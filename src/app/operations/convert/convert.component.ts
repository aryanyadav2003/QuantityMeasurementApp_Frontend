import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../dashboard/navbar.component';
import { QuantityService } from '../quantity.service';
import { QuantityDTO, MeasurementType, UNITS, QuantityMeasurementDTO } from '../../shared/models/quantity.model';

@Component({
  selector: 'app-convert',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NavbarComponent
  ],
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.css']
})
export class ConvertComponent implements OnInit {
  types: MeasurementType[] = ['LENGTH', 'WEIGHT', 'VOLUME', 'TEMPERATURE'];
  measurementType: MeasurementType = 'LENGTH';
  units: string[] = [];

  // The quantity to convert
  q: QuantityDTO = { value: 0, unit: 'FEET', measurementType: 'LENGTH' };

  // Target unit to convert to
  targetUnit = 'INCHES';

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

  onTypeChange(type: MeasurementType) {
    this.measurementType = type;
    this.units      = UNITS[type];
    this.q          = { value: 0, unit: this.units[0], measurementType: type };
    this.targetUnit = this.units[1] || this.units[0];
    this.result     = null;
    this.error      = '';
  }

  convert() {
    this.error   = '';
    this.result  = null;
    this.loading = true;
    
    console.log('CONVERT REQUEST STARTED', { q: this.q, target: this.targetUnit });
    
    this.svc.convert(this.q, this.targetUnit).subscribe({
      next: (res) => {
        console.log('CONVERT REQUEST SUCCESS', res);
        this.result = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('CONVERT REQUEST ERROR', e);
        this.error = e.error?.errorMessage || e.message || 'Conversion failed. Is the backend running?';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}