import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { WalletProvider } from './contexts/WalletContext';
import { UserRoleProvider } from './contexts/UserRoleContext';
import Dashboard from './pages/Dashboard';
import NewRequest from './pages/NewRequest';
import TermSheet from './pages/TermSheet';
import ContractsList from './pages/ContractsList';
import ContractView from './pages/ContractView';
import Settings from './pages/Settings';
import CreateProfile from './pages/CreateProfile';
import SelectRole from './pages/SelectRole';
import BuyingPowerCheck from './pages/BuyingPowerCheck';
import IncomeVerification from './pages/IncomeVerification';
import BuyerPreferences from './pages/BuyerPreferences';
import ProfileSummary from './pages/ProfileSummary';
import OwnerOnboarding from './pages/OwnerOnboarding';
import OwnerVerification from './pages/OwnerVerification';
import PropertyPhotos from './pages/PropertyPhotos';
import SellerFinancingTerms from './pages/SellerFinancingTerms';
import ListingPreview from './pages/ListingPreview';
import Marketplace from './pages/Marketplace';
import InvestorMarketplace from './pages/InvestorMarketplace';
import ListingDetail from './pages/ListingDetail';
import SellerListedHome from './pages/SellerListedHome';
import VisitRequests from './pages/VisitRequests';
import Contract from './pages/Contract';
import Payments from './pages/Payments';
import MerkleRecord from './pages/MerkleRecord';
import NoteOverview from './pages/NoteOverview';
import InvestorConnectWallet from './pages/InvestorConnectWallet';
import InvestorIdentityVerification from './pages/InvestorIdentityVerification';
import InvestorVerificationComplete from './pages/InvestorVerificationComplete';
import InvestorListingDetail from './pages/InvestorListingDetail';

import InvestorDashboard from './pages/InvestorDashboard';
import InvestorContract from './pages/InvestorContract';
import InvestorPayments from './pages/InvestorPayments';
import InvestorNoteOverview from './pages/InvestorNoteOverview';

import BuyerVisitRequests from './pages/BuyerVisitRequests';
import BuyerContract from './pages/BuyerContract';
import BuyerPayments from './pages/BuyerPayments';
import BuyerAsset from './pages/BuyerAsset';
import BuyerProfile from './pages/BuyerProfile';

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <UserRoleProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="new-request" element={<NewRequest />} />
              <Route path="term-sheet" element={<TermSheet />} />
              <Route path="contract" element={<Contract />} />
              <Route path="contracts" element={<ContractsList />} />
              <Route path="contract-view" element={<ContractView />} />
              <Route path="settings" element={<Settings />} />
              <Route path="listed-home" element={<SellerListedHome />} />
              <Route path="visit-requests" element={<VisitRequests />} />
              <Route path="payments" element={<Payments />} />
              <Route path="merkle-record" element={<MerkleRecord />} />
              <Route path="note-overview" element={<NoteOverview />} />

              {/* Investor Dashboard Routes */}
              <Route path="investor/invested" element={<InvestorDashboard />} />
              <Route path="investor/contract" element={<InvestorContract />} />
              <Route path="investor/payments" element={<InvestorPayments />} />
              <Route path="investor/asset" element={<InvestorNoteOverview />} />

              {/* Buyer Dashboard Routes */}
              <Route path="buyer/visit-requests" element={<BuyerVisitRequests />} />
              <Route path="buyer/contract" element={<BuyerContract />} />
              <Route path="buyer/payments" element={<BuyerPayments />} />
              <Route path="buyer/asset" element={<BuyerAsset />} />
              <Route path="buyer/profile" element={<BuyerProfile />} />
            </Route>
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route path="/select-role" element={<SelectRole />} />
            <Route path="/buying-power" element={<BuyingPowerCheck />} />
            <Route path="/income-verification" element={<IncomeVerification />} />
            <Route path="/buyer-preferences" element={<BuyerPreferences />} />
            <Route path="/profile-summary" element={<ProfileSummary />} />
            <Route path="/owner-onboarding" element={<OwnerOnboarding />} />
            <Route path="/owner-verification" element={<OwnerVerification />} />
            <Route path="/property-photos" element={<PropertyPhotos />} />
            <Route path="/seller-financing-terms" element={<SellerFinancingTerms />} />
            <Route path="/listing-preview" element={<ListingPreview />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/listing-detail" element={<ListingDetail />} />
            <Route path="/investor/listing/:id" element={<InvestorListingDetail />} />

            {/* Investor Onboarding Flows */}
            <Route path="/investor-marketplace" element={<InvestorMarketplace />} />
            <Route path="/investor/connect-wallet" element={<InvestorConnectWallet />} />
            <Route path="/investor/identity-verification" element={<InvestorIdentityVerification />} />
            <Route path="/investor/verification-complete" element={<InvestorVerificationComplete />} />
          </Routes>
        </UserRoleProvider>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
