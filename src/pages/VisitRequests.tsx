import React, { useState } from 'react';
import ProfileCard from '../components/dashboard/ProfileCard';
import VisitRequestSchedule from '../components/dashboard/VisitRequestSchedule';
import VisitAcceptanceModal from '../components/dashboard/VisitAcceptanceModal';

const VisitRequests: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [acceptedSlot, setAcceptedSlot] = useState<{ date: string; time: string; ampm: string } | null>(null);

    const buyerData = {
        name: "Chris R.",
        employment: "Stable (12 years, full-time)",
        income: "$20,000/mo",
        dti: "25%",
        creditGrade: "A (760 equivalent)",
        downPayment: "$360,000 (30%)",
        pti: "28%",
        riskGrade: "Tier A",
        evaluationDate: "29-Dec-2025"
    };

    const visitorContact = {
        name: "Chris R.",
        email: "chris.r@example.com",
        phone: "(555) 123-4567"
    };

    const [requestSlots, setRequestSlots] = useState([
        { date: '02/02/2026', time: '11:00', ampm: 'AM' },
        { date: '02/02/2026', time: '08:00', ampm: 'PM' }
    ]);

    const [requestMessage, setRequestMessage] = useState("Hi, I want to visit your home during this or next weekend");

    // Load from localStorage for demo
    React.useEffect(() => {
        const savedRequest = localStorage.getItem('demo_visit_request');
        if (savedRequest) {
            try {
                const parsed = JSON.parse(savedRequest);
                if (parsed.slots && parsed.message) {
                    setRequestSlots(parsed.slots);
                    setRequestMessage(parsed.message);
                }
            } catch (e) {
                console.error("Failed to parse saved visit request", e);
            }
        }
    }, []);

    const handleAccept = (index: number) => {
        setAcceptedSlot(requestSlots[index]);
        setIsModalOpen(true);
    };

    return (
        <div className="container" style={{ padding: '32px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '32px', alignItems: 'start' }}>
                <ProfileCard data={buyerData} />
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
