import React, { useState } from 'react';
import BuyerProfileCard from '../components/dashboard/BuyerProfileCard';
import VisitRequestSchedule from '../components/dashboard/VisitRequestSchedule';
import VisitAcceptanceModal from '../components/dashboard/VisitAcceptanceModal';

const VisitRequests: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [acceptedSlot, setAcceptedSlot] = useState<{ date: string; time: string; ampm: string } | null>(null);

    const buyerData = {
        name: "Chris R.",
        employment: "Stable (3 years, full-time)",
        income: "$6,200/mo",
        dti: "38%",
        creditGrade: "B+ (660 equivalent)",
        downPayment: "$35,000 (12%)",
        pti: "28%",
        riskGrade: "Medium-low risk",
        evaluationDate: "10-Dec-2025"
    };

    const visitorContact = {
        name: "Chris R.",
        email: "chris.r@example.com",
        phone: "(555) 123-4567"
    };

    const requestSlots = [
        { date: '02/02/2026', time: '11:00', ampm: 'AM' },
        { date: '02/02/2026', time: '08:00', ampm: 'PM' }
    ];

    const requestMessage = "Hi, I want to visit your home during this or next weekend";

    const handleAccept = (index: number) => {
        setAcceptedSlot(requestSlots[index]);
        setIsModalOpen(true);
    };

    return (
        <div className="container" style={{ padding: '32px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '32px', alignItems: 'start' }}>
                <BuyerProfileCard data={buyerData} />
                <VisitRequestSchedule
                    slots={requestSlots}
                    message={requestMessage}
                    onAccept={handleAccept}
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

export default VisitRequests;
