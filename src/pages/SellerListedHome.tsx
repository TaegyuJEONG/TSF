import React from 'react';
import MarketplaceCard from '../components/dashboard/MarketplaceCard';
import ListingDetailPreview from '../components/dashboard/ListingDetailPreview';
import listing1Image from '../assets/listing_1.jpg';

const SellerListedHome: React.FC = () => {
    // Mock data matching Marketplace Listing #1
    // 5931 Abernathy Dr, Los Angeles, CA 90045
    // Price: $450,000 | DP: $45,000 | Term: 30y | Rate: 6%
    // 3 beds | 2 baths | 1982 sqft

    const listingData = {
        image: listing1Image,
        price: 450000,
        address: '5931 Abernathy Dr, Los Angeles, CA 90045',
        sqft: 1982,
        specs: {
            dp: 45000,
            term: 30,
            interest: 6,
            beds: 3,
            baths: 2
        },
        tier: 'Tier A',
        negotiable: true,
        description: "This beautiful newly painted 3 bedroom, 2 bath condo offers an open an open floor plan with abundant natural light and small private balcony with city view, perfect for relaxing, weekend coffee, or ice cream. Ideally located near the 101 freeway, Ventura Blvd. The master has a private mirrored vanity. The bedrooms have mirrored closet doors. Walking distance to Tarzana village safari, shopping centers."
    };

    return (
        <div className="container" style={{ padding: '32px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '32px' }}>

                {/* Left Column: Marketplace Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <MarketplaceCard
                        image={listingData.image}
                        price={listingData.price}
                        sqft={listingData.sqft}
                        address={listingData.address}
                        specs={{
                            dp: listingData.specs.dp,
                            term: listingData.specs.term,
                            interest: listingData.specs.interest,
                            beds: listingData.specs.beds,
                            baths: listingData.specs.baths
                        }}
                        tier={listingData.tier}
                        negotiable={listingData.negotiable}
                        isUserListing={true}
                        showBookmark={false}
                        showPricePerSqft={false}
                    />
                </div>

                {/* Right Column: Detail View */}
                <div>
                    <ListingDetailPreview
                        image={listingData.image}
                        price={listingData.price}
                        sqft={listingData.sqft}
                        address={listingData.address}
                        specs={{
                            beds: listingData.specs.beds,
                            baths: listingData.specs.baths
                        }}
                        description={listingData.description}
                    />
                </div>
            </div>
        </div>
    );
};

export default SellerListedHome;
