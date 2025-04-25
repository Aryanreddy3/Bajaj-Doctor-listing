import React from 'react';
import { FilterState } from '../types/doctor';

interface FilterPanelProps {
  filters: FilterState;
  specialties: string[];
  onFilterChange: (filters: Partial<FilterState>) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  specialties,
  onFilterChange,
}) => {
  const handleConsultationModeChange = (mode: 'Video Consult' | 'In Clinic') => {
    onFilterChange({
      consultationMode: filters.consultationMode === mode ? '' : mode,
    });
  };

  const handleSpecialtyChange = (specialty: string) => {
    const updatedSpecialties = filters.specialties.includes(specialty)
      ? filters.specialties.filter(s => s !== specialty)
      : [...filters.specialties, specialty];
    onFilterChange({ specialties: updatedSpecialties });
  };

  const handleSortChange = (sortBy: 'fees' | 'experience') => {
    onFilterChange({ sortBy: filters.sortBy === sortBy ? '' : sortBy });
  };

  return (
    <div className="filter-panel">
      <div className="filter-section">
        <h3 data-testid="filter-header-moc">Consultation Mode</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              checked={filters.consultationMode === 'Video Consult'}
              onChange={() => handleConsultationModeChange('Video Consult')}
              data-testid="filter-video-consult"
            />
            Video Consult
          </label>
          <label>
            <input
              type="radio"
              checked={filters.consultationMode === 'In Clinic'}
              onChange={() => handleConsultationModeChange('In Clinic')}
              data-testid="filter-in-clinic"
            />
            In Clinic
          </label>
        </div>
      </div>

      <div className="filter-section">
        <h3 data-testid="filter-header-speciality">Specialties</h3>
        <div className="checkbox-group">
          {specialties.map((specialty) => (
            <label key={specialty}>
              <input
                type="checkbox"
                checked={filters.specialties.includes(specialty)}
                onChange={() => handleSpecialtyChange(specialty)}
                data-testid={`filter-specialty-${specialty.replace(/\s+/g, '-').replace('/', '-')}`}
              />
              {specialty}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 data-testid="filter-header-sort">Sort By</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              checked={filters.sortBy === 'fees'}
              onChange={() => handleSortChange('fees')}
              data-testid="sort-fees"
            />
            Fees (Low to High)
          </label>
          <label>
            <input
              type="radio"
              checked={filters.sortBy === 'experience'}
              onChange={() => handleSortChange('experience')}
              data-testid="sort-experience"
            />
            Experience (High to Low)
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 