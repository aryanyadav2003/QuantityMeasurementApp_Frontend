import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../dashboard/navbar.component';
import { QuantityService } from '../quantity.service';
import { QuantityDTO, MeasurementType, UNITS, QuantityMeasurementDTO } from '../../shared/models/quantity.model';

@Component({
  selector: 'app-arithmetic',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NavbarComponent
  ],
  templateUrl: './arithmetic.component.html',
  styleUrls: ['./arithmetic.component.css']
})
export class ArithmeticComponent implements OnInit {
  types: MeasurementType[] = ['LENGTH', 'WEIGHT', 'VOLUME', 'TEMPERATURE'];
  measurementType: MeasurementType = 'LENGTH';
  units: string[] = [];

  // Available arithmetic operations
  operations = ['ADD', 'SUBTRACT', 'DIVIDE'];
  selectedOperation = 'ADD';

  q1: QuantityDTO = { value: 0, unit: 'FEET',   measurementType: 'LENGTH' };
  q2: QuantityDTO = { value: 0, unit: 'INCHES',  measurementType: 'LENGTH' };

  // Result unit (not needed for DIVIDE — it returns a plain number)
  targetUnit = 'FEET';

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
    this.q1         = { value: 0, unit: this.units[0], measurementType: type };
    this.q2         = { value: 0, unit: this.units[1] || this.units[0], measurementType: type };
    this.targetUnit = this.units[0];
    this.result     = null;
    this.error      = '';
  }

  // Divide does not need a targetUnit — it returns a scalar ratio
  get showTargetUnit(): boolean {
    return this.selectedOperation !== 'DIVIDE';
  }

  calculate() {
    this.error   = '';
    this.result  = null;
    this.loading = true;

    let obs;
    if (this.selectedOperation === 'ADD') {
      obs = this.svc.add(this.q1, this.q2, this.targetUnit);
    } else if (this.selectedOperation === 'SUBTRACT') {
      obs = this.svc.subtract(this.q1, this.q2, this.targetUnit);
    } else {
      obs = this.svc.divide(this.q1, this.q2);
    }

    obs.subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Calculation Error:', e);
        this.error = e.error?.errorMessage || e.message || 'Operation failed. Is the backend running?';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}