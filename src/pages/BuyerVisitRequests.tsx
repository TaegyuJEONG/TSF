import React, { useState } from 'react';
import MarketplaceCard from '../components/dashboard/MarketplaceCard';
import listing1Image from '../assets/listing_1.jpg';
import VisitRequestSchedule from '../components/dashboard/VisitRequestSchedule';
import VisitAcceptanceModal from '../components/dashboard/VisitAcceptanceModal';

const BuyerVisitRequests: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [acceptedSlot, setAcceptedSlot] = useState<{ date: string; time: string; ampm: string } | null>(null);

    const listingData = {
        image: listing1Image,
        price: 1200000,
        address: '5931 Abernathy Dr, Los Angeles, CA 90045',
        sqft: 5922,
        specs: { dp: 360000, term: 240, interest: 6, beds: 6, baths: 5 },
        tier: 'Tier A',
        negotiable: true,
    };

    const ownerContact = {
        name: "Michael Johnson",
        email: "michael.j@example.com",
        phone: "(555) 123-4567"
    };

    const visitorContact = {
        name: "Michael Johnson",
        email: "michael.j@example.com",
        phone: "(555) 987-6543"
    };

    const requestSlots = [
        { date: '02/05/2026', time: '10:00', ampm: 'AM' },
        { date: '02/06/2026', time: '02:00', ampm: 'PM' }
    ];

    const requestMessage = "Hi, confirmed for the visit.";

    const handleAccept = (index: number) => {
        setAcceptedSlot(requestSlots[index]);
        setIsModalOpen(true);
    };

    return (
        <div className="container" style={{ padding: '32px 0' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>My Scheduled Visits</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '32px', alignItems: 'start' }}>
                <MarketplaceCard
                    image={listingData.image}
                    price={listingData.price}
                    sqft={listingData.sqft}
                    address={listingData.address}
                    specs={listingData.specs}
                    tier={listingData.tier}
                    negotiable={listingData.negotiable}
                    isUserListing={true}
                    showBookmark={false}
                    showPricePerSqft={false}
                />
                <VisitRequestSchedule
                    slots={requestSlots}
                    message={requestMessage}
                    onAccept={handleAccept}
                    viewMode="buyer"
                    confirmedSlotIndex={0}
                    ownerContact={ownerContact}
                />
            </div>

            <VisitAcceptanceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                slot={acceptedSlot}
                visitor={visitorContact}
            />
        </div>
    );
};

export default BuyerVisitRequests;
