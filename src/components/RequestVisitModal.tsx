import React, { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { Input } from './ui/Input';
import { Plus, Trash2 } from 'lucide-react';

interface RequestVisitModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RequestVisitModal: React.FC<RequestVisitModalProps> = ({ isOpen, onClose }) => {
    const [slots, setSlots] = useState([{ date: '', time: '', ampm: 'AM' }]);
    const [message, setMessage] = useState('');

    const addSlot = () => {
        setSlots([...slots, { date: '', time: '', ampm: 'AM' }]);
    };

    const removeSlot = (index: number) => {
        if (slots.length > 1) {
            const newSlots = slots.filter((_, i) => i !== index);
            setSlots(newSlots);
        }
    };

    const updateSlot = (index: number, field: string, value: string) => {
        const newSlots = [...slots];
        // @ts-ignore
        newSlots[index][field] = value;
        setSlots(newSlots);
    };

    const handleSubmit = () => {
        // Mock submission logic
        console.log('Submitting visit request:', { slots, message });
        alert('Visit request sent!');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Available Date & Time Section */}
                <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 500, marginBottom: '12px', color: '#111827' }}>Available date & time</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {slots.map((slot, index) => (
                            <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <Input
                                    placeholder="mm/dd/yyyy"
                                    value={slot.date}
                                    onChange={(e) => updateSlot(index, 'date', e.target.value)}
                                    onFocus={(e) => e.target.placeholder = ''}
                                    onBlur={(e) => e.target.placeholder = 'mm/dd/yyyy'}
                                    containerStyle={{ flex: 2, marginBottom: 0 }}
                                    style={{ fontSize: '14px', textAlign: 'center', height: '42px' }}
                                />
                                <Input
                                    placeholder="00:00"
                                    value={slot.time}
                                    onChange={(e) => updateSlot(index, 'time', e.target.value)}
                                    onFocus={(e) => e.target.placeholder = ''}
                                    onBlur={(e) => e.target.placeholder = '00:00'}
                                    containerStyle={{ flex: 1, marginBottom: 0 }}
                                    style={{ fontSize: '14px', textAlign: 'center', height: '42px' }}
                                />
                                <button
                                    onClick={() => updateSlot(index, 'ampm', slot.ampm === 'AM' ? 'PM' : 'AM')}
                                    style={{
                                        flex: 1,
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb',
                                        backgroundColor: 'white',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        color: '#374151',
                                        height: '42px' // Match input height roughly
                                    }}
                                >
                                    {slot.ampm}
                                </button>
                                {slots.length > 1 && (
                                    <button
                                        onClick={() => removeSlot(index)}
                                        style={{
                                            padding: '8px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            backgroundColor: 'transparent',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '42px'
                                        }}
                                    >
                                        <Trash2 size={18} color="#ef4444" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={addSlot}
                        style={{
                            width: '100%',
                            marginTop: '12px',
                            height: '42px',
                            backgroundColor: '#e5e7eb',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <Plus size={20} color="#374151" />
                    </button>
                </div>

                {/* Message Section */}
                <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 500, marginBottom: '12px', color: '#111827' }}>Arrange visit</h3>
                    <textarea
                        placeholder="I want to visit this Sunday..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{
                            width: '100%',
                            height: '140px',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            fontSize: '14px',
                            fontFamily: 'inherit',
                            resize: 'none',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {/* Submit Button */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                    <Button
                        onClick={handleSubmit}
                        style={{
                            backgroundColor: 'black',
                            color: 'white',
                            borderRadius: '24px',
                            padding: '0 32px',
                            height: '44px',
                            fontSize: '15px'
                        }}
                    >
                        Submit
                    </Button>
                </div>

            </div>
        </Modal>
    );
};

export default RequestVisitModal;
