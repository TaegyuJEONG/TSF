import React, { useState } from 'react';
import BuyerProfileCard from '../components/dashboard/BuyerProfileCard';
import VisitRequestSchedule from '../components/dashboard/VisitRequestSchedule';
import VisitAcceptanceModal from '../components/dashboard/VisitAcceptanceModal';

const BuyerVisitRequests: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [acceptedSlot, setAcceptedSlot] = useState<{ date: string; time: string; ampm: string } | null>(null);

    // Should this be the "Seller" viewing the Buyer? 
    // Wait, the original page "VisitRequests" was for the SELLER seeing requests FROM Buyers.
    // If this is the BUYER dashboard, they should see Status of their requests? 
    // Or is this a mirror where the Buyer acts as a "Seller" to themselves?
    // Based on "Buyer Dashboard" usually implies seeing what *I* asked for.
    // HOWEVER, the user asked to "Clone" the pages. 
    // Let's stick to the visual clone first. If logic needs inversion (Buyer seeing their outgoing requests), 
    // that might be a separate step. But `VisitRequests.tsx` shows *Incoming* requests.
    // Use Case: Maybe the Buyer is also selling? Or maybe just re-using the UI for "Scheduled Visits".
    // Let's clone exact UI first as requested.

    const buyerData = {
        name: "Michael Johnson (Owner)", // Inverted context? Or just dummy. Let's keep dummy or set to current user properly later.
        employment: "Self-employed",
        income: "$12,500/mo",
        dti: "22%",
        creditGrade: "A (760)",
        downPayment: "N/A",
        pti: "N/A",
        riskGrade: "Low risk",
        evaluationDate: "10-Dec-2025"
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
            <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '32px', alignItems: 'start' }}>
                <BuyerProfileCard data={buyerData} /> {/* Reusing component, maybe rename purely visual? */}
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

export default BuyerVisitRequests;
