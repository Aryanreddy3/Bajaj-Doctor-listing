import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Doctor, FilterState, SPECIALTIES } from './types/doctor';
import DoctorList from './components/DoctorList';
import FilterPanel from './components/FilterPanel';
import SearchHeader from './components/SearchHeader';
import './App.css';

const API_URL = 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json';

function DoctorListingPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    consultationMode: '',
    specialties: [],
    sortBy: ''
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Component mounted');
    const fetchDoctors = async () => {
      try {
        console.log('Fetching doctors...');
        setLoading(true);
        setError('');
        const response = await axios.get(API_URL);
        console.log('API Response:', response.data);
        
        // Transform the API data to match our Doctor interface
        const transformedDoctors = response.data.map((doctor: any) => ({
          id: doctor.id,
          name: doctor.name,
          specialties: Array.isArray(doctor.specialties) ? doctor.specialties : [],
          experience: typeof doctor.experience === 'number' ? doctor.experience : 0,
          fee: typeof doctor.fee === 'number' ? doctor.fee : 0,
          consultationMode: doctor.consultationMode === 'Video Consult' ? 'Video Consult' : 'In Clinic'
        }));

        console.log('Transformed doctors:', transformedDoctors);
        setDoctors(transformedDoctors);
        setFilteredDoctors(transformedDoctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to load doctors. Please try again later.');
        setDoctors([]);
        setFilteredDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    const consultationMode = (params.get('consultationMode') as FilterState['consultationMode']) || '';
    const specialties = params.get('specialties')?.split(',') || [];
    const sortBy = (params.get('sortBy') as FilterState['sortBy']) || '';

    setFilters({
      search,
      consultationMode,
      specialties,
      sortBy
    });
  }, [location.search]);

  useEffect(() => {
    let result = [...doctors];

    // Apply search filter
    if (filters.search) {
      result = result.filter(doctor =>
        doctor.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply consultation mode filter
    if (filters.consultationMode) {
      result = result.filter(doctor =>
        doctor.consultationMode === filters.consultationMode
      );
    }

    // Apply specialties filter
    if (filters.specialties.length > 0) {
      result = result.filter(doctor =>
        doctor.specialties.some(specialty =>
          filters.specialties.includes(specialty)
        )
      );
    }

    // Apply sorting
    if (filters.sortBy === 'fees') {
      result.sort((a, b) => a.fee - b.fee);
    } else if (filters.sortBy === 'experience') {
      result.sort((a, b) => b.experience - a.experience);
    }

    setFilteredDoctors(result);

    // Update suggestions
    if (filters.search) {
      const matches = doctors
        .filter(doctor =>
          doctor.name.toLowerCase().includes(filters.search.toLowerCase())
        )
        .map(doctor => doctor.name)
        .slice(0, 3);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [filters, doctors]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    const params = new URLSearchParams();
    if (updatedFilters.search) params.set('search', updatedFilters.search);
    if (updatedFilters.consultationMode) params.set('consultationMode', updatedFilters.consultationMode);
    if (updatedFilters.specialties.length) params.set('specialties', updatedFilters.specialties.join(','));
    if (updatedFilters.sortBy) params.set('sortBy', updatedFilters.sortBy);

    navigate(`?${params.toString()}`);
  };

  return (
    <div className="app">
      <SearchHeader
        search={filters.search}
        suggestions={suggestions}
        onSearchChange={(search) => updateFilters({ search })}
      />
      <div className="main-content">
        <FilterPanel
          filters={filters}
          specialties={SPECIALTIES}
          onFilterChange={updateFilters}
        />
        {loading ? (
          <div className="loading">Loading doctors...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <DoctorList doctors={filteredDoctors} />
        )}
      </div>
    </div>
  );
}

function FallbackUI() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Doctor Listing</h1>
      <p>Loading application...</p>
    </div>
  );
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (error: Error) => {
      console.error('Error caught by boundary:', error);
      setHasError(true);
      setError(error);
    };

    window.addEventListener('error', (event) => handleError(event.error));
    return () => window.removeEventListener('error', (event) => handleError(event.error));
  }, []);

  if (hasError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Something went wrong</h1>
        <p>{error?.message}</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }

  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<DoctorListingPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
