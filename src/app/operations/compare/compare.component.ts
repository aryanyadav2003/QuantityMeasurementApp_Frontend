import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../dashboard/navbar.component';
import { QuantityService } from '../quantity.service';
import { QuantityDTO, MeasurementType, UNITS, QuantityMeasurementDTO } from '../../shared/models/quantity.model';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NavbarComponent
  ],
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {
  // All measurement types the user can pick from
  types: MeasurementType[] = ['LENGTH', 'WEIGHT', 'VOLUME', 'TEMPERATURE'];
  measurementType: MeasurementType = 'LENGTH';

  // Available units for the selected type
  units: string[] = [];

  // The two quantities to compare
  q1: QuantityDTO = { value: 0, unit: 'FEET',   measurementType: 'LENGTH' };
  q2: QuantityDTO = { value: 0, unit: 'INCHES',  measurementType: 'LENGTH' };

  result:  QuantityMeasurementDTO | null = null;
  loading: boolean = false;
  error:   string  = '';

  constructor(
    private svc: QuantityService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.onTypeChange('LENGTH');
  }

  // When user changes the measurement type, reset units and quantities
  onTypeChange(type: MeasurementType) {
    this.measurementType = type;
    this.units = UNITS[type];
    this.q1 = { value: 0, unit: this.units[0],    measurementType: type };
    this.q2 = { value: 0, unit: this.units[1] || this.units[0], measurementType: type };
    this.result = null;
    this.error  = '';
  }

  // Send comparison request to backend
  compare() {
    this.error   = '';
    this.result  = null;
    this.loading = true;
    
    this.svc.compare(this.q1, this.q2).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Compare Error:', e);
        this.error = e.error?.errorMessage || e.message || 'Comparison failed. Is the backend running?';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}