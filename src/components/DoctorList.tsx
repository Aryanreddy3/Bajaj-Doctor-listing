import React from 'react';
import { Doctor } from '../types/doctor';

interface DoctorListProps {
  doctors: Doctor[];
}

const DoctorList: React.FC<DoctorListProps> = ({ doctors }) => {
  if (!doctors || doctors.length === 0) {
    return (
      <div className="no-results">
        <h3>No doctors found</h3>
        <p>Try adjusting your search criteria or filters</p>
      </div>
    );
  }

  return (
    <div className="doctor-list">
      {doctors.map((doctor) => (
        <div key={doctor.id} className="doctor-card" data-testid="doctor-card">
          <div className="doctor-header">
            <h2 data-testid="doctor-name">{doctor.name}</h2>
            <span className="consultation-mode">
              {doctor.consultationMode === 'Video Consult' ? '🎥' : '🏥'} {doctor.consultationMode}
            </span>
          </div>
          <div className="doctor-details">
            <p>
              <strong>Specialties:</strong>
              <span data-testid="doctor-specialty">
                {Array.isArray(doctor.specialties) ? doctor.specialties.join(', ') : 'Not specified'}
              </span>
            </p>
            <p>
              <strong>Experience:</strong>
              <span data-testid="doctor-experience">
                {doctor.experience} years
              </span>
            </p>
            <p>
              <strong>Consultation Fee:</strong>
              <span data-testid="doctor-fee" className="fee">
                ₹{doctor.fee.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorList; 