import { memo } from 'react';
import { PubMarkerArtwork } from './PubMarkerArtwork';

type Props = { count: number };

export const PubCluster = memo(function PubCluster({ count }: Props) {
    return <PubMarkerArtwork label={String(count)} accessibilityLabel={`${count} pubs`} />;
});
