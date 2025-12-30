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
        price: 1200000,
        address: '5931 Abernathy Dr, Los Angeles, CA 90045',
        sqft: 5922,
        specs: {
            dp: 360000,
            term: 240,
            interest: 6,
            beds: 6,
            baths: 5
        },
        tier: 'Tier A',
        negotiable: true,
        zestimate: 1150000,
        monthlyPayment: 6018,
        description: "This stunning 6 bedroom, 5 bath estate offers an expansive open floor plan with soaring ceilings and abundant natural light throughout its 5,922 square feet. The gourmet kitchen features high-end appliances and opens to a spacious family room, perfect for entertaining. The luxurious master suite includes a spa-like bathroom and walk-in closet. Additional bedrooms are generously sized with ample storage. The property features a beautiful backyard with mountain views, ideal for outdoor living and relaxation. Located in a premier Los Angeles neighborhood near top-rated schools, shopping, and dining."
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
                        showEditButton={true}

                        // New Financial Props
                        zestimate={listingData.zestimate}
                        downPayment={listingData.specs.dp}
                        term={listingData.specs.term}
                        interestRate={listingData.specs.interest}
                        monthlyPayment={listingData.monthlyPayment}
                        riskCategory={listingData.tier}
                        negotiable={listingData.negotiable}
                    />
                </div>
            </div>
        </div>
    );
};

export default SellerListedHome;
