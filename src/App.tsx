import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
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
import ListingDetail from './pages/ListingDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="new-request" element={<NewRequest />} />
          <Route path="term-sheet" element={<TermSheet />} />
          <Route path="contracts" element={<ContractsList />} />
          <Route path="contract-view" element={<ContractView />} />
          <Route path="settings" element={<Settings />} />
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

      </Routes>




    </BrowserRouter>
  );
}

export default App;
