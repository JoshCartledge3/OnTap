import { memo } from 'react';
import { PubMarkerArtwork } from './PubMarkerArtwork';

type Props = { rating: number | null; active: boolean };

export const PubMarker = memo(function PubMarker({ rating, active }: Props) {
    return (
        <PubMarkerArtwork
            label={rating === null ? undefined : rating.toFixed(1)}
            rating={rating !== null}
            active={active}
            accessibilityLabel={rating === null ? 'Pub' : `Pub rated ${rating.toFixed(1)}`}
        />
    );
});
