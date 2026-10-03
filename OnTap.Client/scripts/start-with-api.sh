#!/bin/sh

set -eu

project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
api_dir="$project_dir/../OnTap.Api"
api_pid=""

# Supply the current host at startup, without saving developer-specific IPs.
if [ -z "${EXPO_PUBLIC_API_URL:-}" ]; then
    api_host=$(node -e '
        const interfaces = require("node:os").networkInterfaces();
        const addresses = Object.entries(interfaces)
            .filter(([name]) => !/^(lo|utun|tun|tap|docker|veth|br-|vmnet|tailscale)/i.test(name))
            .flatMap(([, entries]) => entries ?? [])
            .filter(entry => entry.family === "IPv4" && !entry.internal);
        const privateAddresses = addresses.filter(({ address }) =>
            /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(address));
        const candidates = privateAddresses.length ? privateAddresses : addresses;
        if (candidates.length !== 1) {
            console.error("Could not identify one LAN address. Set EXPO_PUBLIC_API_URL explicitly.");
            process.exit(1);
        }
        process.stdout.write(candidates[0].address);
    ')
    export EXPO_PUBLIC_API_URL="http://$api_host:5164"
fi

api_url="$EXPO_PUBLIC_API_URL"

if [ ! -d "$api_dir" ]; then
    echo "OnTap.Api was not found at $api_dir" >&2
    exit 1
fi

if ! command -v dotnet >/dev/null 2>&1; then
    echo "dotnet was not found on PATH" >&2
    exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
    echo "curl was not found on PATH" >&2
    exit 1
fi

cleanup() {
    status=$?
    trap - EXIT HUP INT TERM

    if [ -n "$api_pid" ] && kill -0 "$api_pid" 2>/dev/null; then
        kill "$api_pid" 2>/dev/null || true
        wait "$api_pid" 2>/dev/null || true
    fi

    exit "$status"
}

trap cleanup EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

# Probe the address used by devices, not just the Mac's localhost listener.
if curl --fail --silent --max-time 2 --output /dev/null "$api_url/openapi/v1.json"; then
    echo "OnTap API is already running."
else
    (
        cd "$api_dir"
        exec dotnet run --launch-profile https
    ) &
    api_pid=$!

    attempts=0
    until curl --fail --silent --max-time 2 --output /dev/null "$api_url/openapi/v1.json"; do
        if ! kill -0 "$api_pid" 2>/dev/null; then
            echo "OnTap API failed to start. Check its output above." >&2
            exit 1
        fi
        attempts=$((attempts + 1))
        if [ "$attempts" -ge 60 ]; then
            echo "Timed out waiting for OnTap API to start." >&2
            exit 1
        fi
        sleep 1
    done
fi

printf '\nDevice API: %s\nSwagger UI: https://localhost:7243/swagger\n\n' "$api_url"

cd "$project_dir"
"$project_dir/node_modules/.bin/expo" "$@"
