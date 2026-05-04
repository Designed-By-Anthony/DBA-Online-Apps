'use client';

import { useCallback, useId, useState } from 'react';
import {
  calcCellulose,
  calcConcrete,
  calcFlooring,
  calcFraming,
  calcInsulation,
  calcLabor,
  calcPaint,
  calcRafters,
  calcRoofing,
  calcRoofingSquares,
  calcRoofPitch,
  calcSiding,
  calcSprayFoam,
  calcWireGauge,
} from '@/calculators';
import type { CalculationResult } from '@/types';

const PURCHASE_URL = 'https://designedbyanthony.com/tools';

// ─── Category / Calculator registry ──────────────────────────────────────────

const CATEGORIES = [
  {
    id: 'concrete',
    label: 'Concrete',
    calcs: [
      { id: 'concrete-slab', label: 'Concrete Slab' },
      { id: 'concrete-footing', label: 'Footing' },
      { id: 'concrete-forms', label: 'Slab with Forms' },
    ],
  },
  {
    id: 'framing',
    label: 'Framing',
    calcs: [
      { id: 'wall-studs', label: 'Wall Studs' },
      { id: 'rafter-length', label: 'Rafter Length' },
      { id: 'roofing-squares', label: 'Roofing Squares' },
    ],
  },
  {
    id: 'roofing',
    label: 'Roofing',
    calcs: [
      { id: 'shingles', label: 'Shingles' },
      { id: 'metal-roof', label: 'Metal Roof' },
      { id: 'roof-pitch', label: 'Roof Pitch' },
    ],
  },
  {
    id: 'insulation',
    label: 'Insulation',
    calcs: [
      { id: 'batt-insulation', label: 'Batt Insulation' },
      { id: 'spray-foam', label: 'Spray Foam' },
      { id: 'cellulose', label: 'Cellulose Blown-In' },
    ],
  },
  {
    id: 'finishes',
    label: 'Finishes',
    calcs: [
      { id: 'flooring', label: 'Flooring' },
      { id: 'siding', label: 'Siding' },
      { id: 'paint', label: 'Paint' },
    ],
  },
  {
    id: 'electrical',
    label: 'Electrical',
    calcs: [{ id: 'wire-gauge', label: 'Wire Gauge' }],
  },
  {
    id: 'labor',
    label: 'Labor',
    calcs: [{ id: 'labor-cost', label: 'Labor Cost' }],
  },
] as const;

type CalcId =
  | 'concrete-slab'
  | 'concrete-footing'
  | 'concrete-forms'
  | 'wall-studs'
  | 'rafter-length'
  | 'roofing-squares'
  | 'shingles'
  | 'metal-roof'
  | 'roof-pitch'
  | 'batt-insulation'
  | 'spray-foam'
  | 'cellulose'
  | 'flooring'
  | 'siding'
  | 'paint'
  | 'wire-gauge'
  | 'labor-cost';

// ─── Helper: controlled number input ─────────────────────────────────────────

function NumInput({
  label,
  value,
  onChange,
  unit,
  min = 0,
  step = 1,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit?: string;
  min?: number;
  step?: number;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="field-row">
        <input
          id={id}
          type="number"
          className="field-input"
          value={value}
          min={min}
          step={step}
          placeholder={placeholder ?? '0'}
          onChange={(e) => onChange(e.target.value)}
        />
        {unit ? <span className="field-unit">{unit}</span> : null}
      </div>
    </div>
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <select
        id={id}
        className="field-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckInput({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="check-row">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

// ─── Results panel ────────────────────────────────────────────────────────────

function Results({
  results,
  locked = false,
}: {
  results: CalculationResult[];
  locked?: boolean;
}) {
  if (!results.length) return null;
  return (
    <div className="results" style={locked ? { position: 'relative' } : undefined}>
      <p className="results-heading">Results</p>
      <div
        className="result-list"
        style={locked ? { filter: 'blur(4px)', opacity: 0.35, pointerEvents: 'none' } : undefined}
      >
        {results.map((r, i) => (
          <div key={i} className={`result-row${r.highlight ? ' result-row--highlight' : ''}`}>
            <div className="result-label">{r.label}</div>
            <div className="result-value">
              <span className="result-num">{r.value}</span>
              {r.unit ? <span className="result-unit">{r.unit}</span> : null}
            </div>
            {r.description ? <div className="result-desc">{r.description}</div> : null}
          </div>
        ))}
      </div>
      {locked ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(8px)',
            borderRadius: 16,
            textAlign: 'center',
            padding: '2rem',
          }}
        >
          <div>
            <p style={{ margin: '0 0 8px', fontWeight: 700, fontSize: '1.05rem' }}>
              Unlock calculator results
            </p>
            <p style={{ margin: '0 0 16px', color: 'var(--muted, #64748b)' }}>
              Keep the inputs, unlock exact quantities and material totals.
            </p>
            <a
              href={PURCHASE_URL}
              className="primary-button"
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              Unlock Full Access →
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ─── Calculator forms ─────────────────────────────────────────────────────────

function ConcreteForm({ type, locked = false }: { type: 'slab' | 'footing' | 'forms'; locked?: boolean }) {
  const [length, setLength] = useState('10');
  const [width, setWidth] = useState('10');
  const [thickness, setThickness] = useState('4');
  const [bagSize, setBagSize] = useState('80');
  const [waste, setWaste] = useState('10');
  const [includeWaste, setIncludeWaste] = useState(true);

  const results = calcConcrete({
    type,
    length: parseFloat(length) || 0,
    width: parseFloat(width) || 0,
    thickness: parseFloat(thickness) || 4,
    bagSize: parseInt(bagSize, 10) === 60 ? 60 : 80,
    waste: parseFloat(waste) || 10,
    includeWaste,
  });

  return (
    <div className="calc-form">
      <div className="fields">
        <NumInput label="Length" value={length} onChange={setLength} unit="ft" />
        <NumInput label="Width" value={width} onChange={setWidth} unit="ft" />
        <NumInput
          label="Thickness"
          value={thickness}
          onChange={setThickness}
          unit="in"
          step={0.5}
        />
        <SelectInput
          label="Bag Size"
          value={bagSize}
          onChange={setBagSize}
          options={[
            { value: '80', label: '80 lb bags' },
            { value: '60', label: '60 lb bags' },
          ]}
        />
        <NumInput label="Waste %" value={waste} onChange={setWaste} unit="%" min={0} />
        <CheckInput
          label="Include waste factor"
          checked={includeWaste}
          onChange={setIncludeWaste}
        />
      </div>
      <Results results={results} locked={locked} />
    </div>
  );
}

function FramingForm({ locked = false }: { locked?: boolean }) {
  const [wallLength, setWallLength] = useState('20');
  const [wallHeight, setWallHeight] = useState('9');
  const [spacing, setSpacing] = useState('16');
  const [hasSheathing, setHasSheathing] = useState(false);
  const [hasDrywall, setHasDrywall] = useState(false);
  const [waste, setWaste] = useState('10');
  const [includeWaste, setIncludeWaste] = useState(true);

  const results = calcFraming({
    wallLength: parseFloat(wallLength) || 0,
    wallHeight: parseFloat(wallHeight) || 0,
    spacing: (parseInt(spacing, 10) as 12 | 16 | 24) || 16,
    hasSheathing,
    hasDrywall,
    waste: parseFloat(waste) || 10,
    includeWaste,
  });

  return (
    <div className="calc-form">
      <div className="fields">
        <NumInput label="Wall Length" value={wallLength} onChange={setWallLength} unit="ft" />
        <NumInput label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" />
        <SelectInput
          label="Stud Spacing"
          value={spacing}
          onChange={setSpacing}
          options={[
            { value: '12', label: '12" OC' },
            { value: '16', label: '16" OC' },
            { value: '24', label: '24" OC' },
          ]}
        />
        <NumInput label="Waste %" value={waste} onChange={setWaste} unit="%" min={0} />
        <CheckInput
          label="Include waste factor"
          checked={includeWaste}
          onChange={setIncludeWaste}
        />
        <CheckInput label="Include sheathing" checked={hasSheathing} onChange={setHasSheathing} />
        <CheckInput label="Include drywall" checked={hasDrywall} onChange={setHasDrywall} />
      </div>
      <Results results={results} locked={locked} />
    </div>
  );
}

function RafterForm({ locked = false }: { locked?: boolean }) {
  const [span, setSpan] = useState('24');
  const [pitch, setPitch] = useState('6');
  const [overhang, setOverhang] = useState('12');
  const [count, setCount] = useState('10');

  const results = calcRafters({
    span: parseFloat(span) || 0,
    pitch: parseFloat(pitch) || 6,
    overhang: parseFloat(overhang) || 0,
    count: parseInt(count, 10) || 0,
  });

  return (
    <div className="calc-form">
      <div className="fields">
        <NumInput label="Building Span" value={span} onChange={setSpan} unit="ft" />
        <NumInput label="Roof Pitch" value={pitch} onChange={setPitch} unit="/12" step={0.5} />
        <NumInput label="Overhang" value={overhang} onChange={setOverhang} unit="in" />
        <NumInput label="Number of Rafters" value={count} onChange={setCount} unit="ea" />
      </div>
      <Results results={results} locked={locked} />
    </div>
  );
}

function RoofingSquaresForm({ locked = false }: { locked?: boolean }) {
  const [length, setLength] = useState('40');
  const [width, setWidth] = useState('25');
  const [pitch, setPitch] = useState('6');
  const [waste, setWaste] = useState('10');
  const [includeWaste, setIncludeWaste] = useState(true);

  const results = calcRoofingSquares({
    length: parseFloat(length) || 0,
    width: parseFloat(width) || 0,
    pitch: parseFloat(pitch) || 6,
    waste: parseFloat(waste) || 10,
    includeWaste,
  });

  return (
    <div className="calc-form">
      <div className="fields">
        <NumInput label="Roof Length" value={length} onChange={setLength} unit="ft" />
        <NumInput label="Roof Width" value={width} onChange={setWidth} unit="ft" />
        <NumInput label="Pitch" value={pitch} onChange={setPitch} unit="/12" step={0.5} />
        <NumInput label="Waste %" value={waste} onChange={setWaste} unit="%" min={0} />
        <CheckInput
          label="Include waste factor"
          checked={includeWaste}
          onChange={setIncludeWaste}
        />
      </div>
      <Results results={results} locked={locked} />
    </div>
  );
}

function RoofingForm({ type, locked = false }: { type: 'shingles' | 'metal'; locked?: boolean }) {
  const [length, setLength] = useState('40');
  const [width, setWidth] = useState('25');
  const [pitch, setPitch] = useState('6');
  const [hasDecking, setHasDecking] = useState(false);
  const [waste, setWaste] = useState('10');
  const [includeWaste, setIncludeWaste] = useState(true);

  const results = calcRoofing({
    length: parseFloat(length) || 0,
    width: parseFloat(width) || 0,
    pitch: parseFloat(pitch) || 6,
    type,
    hasDecking,
    waste: parseFloat(waste) || 10,
    includeWaste,
  });

  return (
    <div className="calc-form">
      <div className="fields">
        <NumInput label="Roof Length" value={length} onChange={setLength} unit="ft" />
        <NumInput label="Roof Width" value={width} onChange={setWidth} unit="ft" />
        <NumInput label="Pitch" value={pitch} onChange={setPitch} unit="/12" step={0.5} />
        <NumInput label="Waste %" value={waste} onChange={setWaste} unit="%" min={0} />
        <CheckInput
          label="Include waste factor"
          checked={includeWaste}
          onChange={setIncludeWaste}
        />
        <CheckInput label="Include roof decking" checked={hasDecking} onChange={setHasDecking} />
      </div>
      <Results results={results} locked={locked} />
    </div>
  );
}

function RoofPitchForm({ locked = false }: { locked?: boolean }) {
  const [rise, setRise] = useState('6');
  const [run, setRun] = useState('12');
  const [spanFt, setSpanFt] = useState('24');

  const results = calcRoofPitch({
    rise: parseFloat(rise) || 6,
    run: parseFloat(run) || 12,
    spanFt: parseFloat(spanFt) || 0,
  });

  return (
    <div className="calc-form">
      <div className="fields">
        <NumInput label="Rise (vertical)" value={rise} onChange={setRise} unit="in" step={0.5} />
        <NumInput label="Run (horizontal)" value={run} onChange={setRun} unit="in" step={0.5} />
        <NumInput
          label="Building Span (for rafter)"
          value={spanFt}
          onChange={setSpanFt}
          unit="ft"
        />
      </div>
      <Results results={results} locked={locked} />
    </div>
  );
}

function InsulationForm({ locked = false }: { locked?: boolean }) {
  const [area, setArea] = useState('500');
  const [rValue, setRValue] = useState('19');
  const [spacing, setSpacing] = useState('16');
  const [studSize, setStudSize] = useState('2x6');
  const [waste, setWaste] = useState('10');
  const [includeWaste, setIncludeWaste] = useState(true);

  const results = calcInsulation({
    area: parseFloat(area) || 0,
    type: 'batt',
    rValue: parseFloat(rValue) || 19,
    spacing: parseInt(spacing, 10) === 24 ? 24 : 16,
    studSize: studSize === '2x4' ? '2x4' : '2x6',
    waste: parseFloat(waste) || 10,
    includeWaste,
  });

  return (
    <div className="calc-form">
      <div className="fields">
        <NumInput label="Area to Insulate" value={area} onChange={setArea} unit="sq ft" />
        <NumInput label="Target R-Value" value={rValue} onChange={setRValue} unit="R" />
        <SelectInput
          label="Stud Spacing"
          value={spacing}
          onChange={setSpacing}
          options={[
            { value: '16', label: '16" OC' },
            { value: '24', label: '24" OC' },
          ]}
        />
        <SelectInput
          label="Stud Size"
          value={studSize}
          onChange={setStudSize}
          options={[
            { value: '2x4', label: '2×4 walls (3.5")' },
            { value: '2x6', label: '2×6 walls (5.5")' },
          ]}
        />
        <NumInput label="Waste %" value={waste} onChange={setWaste} unit="%" min={0} />
        <CheckInput
          label="Include waste factor"
          checked={includeWaste}
          onChange={setIncludeWaste}
        />
      </div>
      <Results results={results} locked={locked} />
    </div>
  );
}

function SprayFoamForm({ locked = false }: { locked?: boolean }) {
  const [area, setArea] = useState('500');
  const [thickness, setThickness] = useState('2');
  const [foamType, setFoamType] = useState('closed');
  const [waste, setWaste] = useState('10');
  const [includeWaste, setIncludeWaste] = useState(true);

  const results = calcSprayFoam({
    area: parseFloat(area) || 0,
    thickness: parseFloat(thickness) || 2,
    type: foamType === 'open' ? 'open' : 'closed',
    waste: parseFloat(waste) || 10,
    includeWaste,
  });

  return (
    <div className="calc-form">
      <div className="fields">
        <NumInput label="Area" value={area} onChange={setArea} unit="sq ft" />
        <NumInput
          label="Thickness"
          value={thickness}
          onChange={setThickness}
          unit="in"
          step={0.5}
        />
        <SelectInput
          label="Foam Type"
          value={foamType}
          onChange={setFoamType}
          options={[
            { value: 'closed', label: 'Closed-cell (R-6.5/in)' },
            { value: 'open', label: 'Open-cell (R-3.7/in)' },
          ]}
        />
        <NumInput label="Waste %" value={waste} onChange={setWaste} unit="%" min={0} />
        <CheckInput
          label="Include waste factor"
          checked={includeWaste}
          onChange={setIncludeWaste}
        />
      </div>
      <Results results={results} locked={locked} />
    </div>
  );
}

function CelluloseForm({ locked = false }: { locked?: boolean }) {
  const [area, setArea] = useState('800');
  const [rValue, setRValue] = useState('38');
  const [cellType, setCellType] = useState('attic');
  const [waste, setWaste] = useState('10');
  const [includeWaste, setIncludeWaste] = useState(true);

  const results = calcCellulose({
    area: parseFloat(area) || 0,
    rValue: parseFloat(rValue) || 38,
    type: cellType === 'dense-pack' ? 'dense-pack' : 'attic',
    waste: parseFloat(waste) || 10,
    includeWaste,
  });

  return (
    <div className="calc-form">
      <div className="fields">
        <NumInput label="Area" value={area} onChange={setArea} unit="sq ft" />
        <NumInput label="Target R-Value" value={rValue} onChange={setRValue} unit="R" />
        <SelectInput
          label="Installation Type"
          value={cellType}
          onChange={setCellType}
          options={[
            { value: 'attic', label: 'Attic (blown-in)' },
            { value: 'dense-pack', label: 'Wall (dense-pack)' },
          ]}
        />
        <NumInput label="Waste %" value={waste} onChange={setWaste} unit="%" min={0} />
        <CheckInput
          label="Include waste factor"
          checked={includeWaste}
          onChange={setIncludeWaste}
        />
      </div>
      <Results results={results} locked={locked} />
    </div>
  );
}

function FlooringForm({ locked = false }: { locked?: boolean }) {
  const [length, setLength] = useState('20');
  const [width, setWidth] = useState('15');
  const [costPerSqFt, setCostPerSqFt] = useState('3.50');
  const [floorType, setFloorType] = useState('lvp');
  const [waste, setWaste] = useState('10');
  const [includeWaste, setIncludeWaste] = useState(true);

  const results = calcFlooring({
    length: parseFloat(length) || 0,
    width: parseFloat(width) || 0,
    costPerSqFt: parseFloat(costPerSqFt) || 0,
    waste: parseFloat(waste) || 10,
    includeWaste,
  });

  return (
    <div className="calc-form">
      <div className="fields">
        <NumInput label="Room Length" value={length} onChange={setLength} unit="ft" />
        <NumInput label="Room Width" value={width} onChange={setWidth} unit="ft" />
        <SelectInput
          label="Floor Type"
          value={floorType}
          onChange={setFloorType}
          options={[
            { value: 'lvp', label: 'LVP / Vinyl Plank' },
            { value: 'hardwood', label: 'Hardwood' },
            { value: 'tile', label: 'Tile' },
            { value: 'carpet', label: 'Carpet' },
            { value: 'subfloor', label: 'Subfloor' },
          ]}
        />
        <NumInput
          label="Cost per sq ft"
          value={costPerSqFt}
          onChange={setCostPerSqFt}
          unit="$/sqft"
          step={0.25}
        />
        <NumInput label="Waste %" value={waste} onChange={setWaste} unit="%" min={0} />
        <CheckInput
          label="Include waste factor"
          checked={includeWaste}
          onChange={setIncludeWaste}
        />
      </div>
      <Results results={results} locked={locked} />
    </div>
  );
}

function SidingForm({ locked = false }: { locked?: boolean }) {
  const [area, setArea] = useState('800');
  const [sidingType, setSidingType] = useState('vinyl');
  const [waste, setWaste] = useState('10');
  const [includeWaste, setIncludeWaste] = useState(true);

  const results = calcSiding({
    area: parseFloat(area) || 0,
    waste: parseFloat(waste) || 10,
    includeWaste,
  });

  return (
    <div className="calc-form">
      <div className="fields">
        <NumInput label="Wall Area" value={area} onChange={setArea} unit="sq ft" />
        <SelectInput
          label="Siding Type"
          value={sidingType}
          onChange={setSidingType}
          options={[
            { value: 'vinyl', label: 'Vinyl' },
            { value: 'wood', label: 'Wood' },
            { value: 'fiber-cement', label: 'Fiber Cement (Hardie)' },
          ]}
        />
        <NumInput label="Waste %" value={waste} onChange={setWaste} unit="%" min={0} />
        <CheckInput
          label="Include waste factor"
          checked={includeWaste}
          onChange={setIncludeWaste}
        />
      </div>
      <Results results={results} locked={locked} />
    </div>
  );
}

function PaintForm({ locked = false }: { locked?: boolean }) {
  const [area, setArea] = useState('600');
  const [coats, setCoats] = useState('2');
  const [waste, setWaste] = useState('10');
  const [includeWaste, setIncludeWaste] = useState(true);

  const results = calcPaint({
    area: parseFloat(area) || 0,
    coats: parseInt(coats, 10) || 2,
    waste: parseFloat(waste) || 10,
    includeWaste,
  });

  return (
    <div className="calc-form">
      <div className="fields">
        <NumInput
          label="Surface Area"
          value={area}
          onChange={setArea}
          unit="sq ft"
          placeholder="Total wall area"
        />
        <NumInput label="Number of Coats" value={coats} onChange={setCoats} unit="coats" min={1} />
        <NumInput label="Waste %" value={waste} onChange={setWaste} unit="%" min={0} />
        <CheckInput
          label="Include waste factor"
          checked={includeWaste}
          onChange={setIncludeWaste}
        />
      </div>
      <Results results={results} locked={locked} />
    </div>
  );
}

function WireGaugeForm({ locked = false }: { locked?: boolean }) {
  const [amps, setAmps] = useState('20');
  const [voltage, setVoltage] = useState('120');
  const [distance, setDistance] = useState('50');
  const [material, setMaterial] = useState('copper');

  const results = calcWireGauge({
    amps: parseFloat(amps) || 20,
    voltage: parseFloat(voltage) || 120,
    distance: parseFloat(distance) || 0,
    material: material === 'aluminum' ? 'aluminum' : 'copper',
  });

  return (
    <div className="calc-form">
      <div className="fields">
        <NumInput label="Load (Amps)" value={amps} onChange={setAmps} unit="A" />
        <SelectInput
          label="Voltage"
          value={voltage}
          onChange={setVoltage}
          options={[
            { value: '120', label: '120V' },
            { value: '240', label: '240V' },
            { value: '208', label: '208V' },
          ]}
        />
        <NumInput label="One-Way Run" value={distance} onChange={setDistance} unit="ft" />
        <SelectInput
          label="Conductor Material"
          value={material}
          onChange={setMaterial}
          options={[
            { value: 'copper', label: 'Copper' },
            { value: 'aluminum', label: 'Aluminum' },
          ]}
        />
      </div>
      <Results results={results} locked={locked} />
    </div>
  );
}

function LaborForm({ locked = false }: { locked?: boolean }) {
  const [workers, setWorkers] = useState('3');
  const [hours, setHours] = useState('8');
  const [wage, setWage] = useState('35');

  const results = calcLabor({
    workers: parseFloat(workers) || 0,
    hours: parseFloat(hours) || 0,
    wage: parseFloat(wage) || 0,
  });

  return (
    <div className="calc-form">
      <div className="fields">
        <NumInput label="Number of Workers" value={workers} onChange={setWorkers} unit="workers" />
        <NumInput
          label="Hours per Worker"
          value={hours}
          onChange={setHours}
          unit="hrs"
          step={0.5}
        />
        <NumInput label="Hourly Wage" value={wage} onChange={setWage} unit="$/hr" step={0.5} />
      </div>
      <Results results={results} locked={locked} />
    </div>
  );
}

// ─── Main hub ─────────────────────────────────────────────────────────────────

export function CalculatorHub({ locked = false }: { locked?: boolean }) {
  const [activeCatId, setActiveCatId] = useState<string>('concrete');
  const [activeCalcId, setActiveCalcId] = useState<CalcId>('concrete-slab');

  const activeCategory = CATEGORIES.find((c) => c.id === activeCatId)!;

  const handleCatSelect = useCallback((catId: string) => {
    setActiveCatId(catId);
    const cat = CATEGORIES.find((c) => c.id === catId)!;
    setActiveCalcId(cat.calcs[0].id as CalcId);
  }, []);

  const activeCalcLabel = activeCategory.calcs.find((c) => c.id === activeCalcId)?.label ?? '';

  function renderCalcForm(id: CalcId) {
    switch (id) {
      case 'concrete-slab':
        return <ConcreteForm type="slab" locked={locked} />;
      case 'concrete-footing':
        return <ConcreteForm type="footing" locked={locked} />;
      case 'concrete-forms':
        return <ConcreteForm type="forms" locked={locked} />;
      case 'wall-studs':
        return <FramingForm locked={locked} />;
      case 'rafter-length':
        return <RafterForm locked={locked} />;
      case 'roofing-squares':
        return <RoofingSquaresForm locked={locked} />;
      case 'shingles':
        return <RoofingForm type="shingles" locked={locked} />;
      case 'metal-roof':
        return <RoofingForm type="metal" locked={locked} />;
      case 'roof-pitch':
        return <RoofPitchForm locked={locked} />;
      case 'batt-insulation':
        return <InsulationForm locked={locked} />;
      case 'spray-foam':
        return <SprayFoamForm locked={locked} />;
      case 'cellulose':
        return <CelluloseForm locked={locked} />;
      case 'flooring':
        return <FlooringForm locked={locked} />;
      case 'siding':
        return <SidingForm locked={locked} />;
      case 'paint':
        return <PaintForm locked={locked} />;
      case 'wire-gauge':
        return <WireGaugeForm locked={locked} />;
      case 'labor-cost':
        return <LaborForm locked={locked} />;
    }
  }

  return (
    <div className="hub">
      {/* hero */}
      <header className="calc-hero">
        <div className="calc-hero-inner">
          <p className="calc-hero-eyebrow">14 calculators · free to use</p>
          <h1 className="calc-hero-title">Construction&nbsp;Calculator</h1>
          <p className="calc-hero-sub">
            Concrete, framing, roofing, insulation, flooring, electrical, and labor. Type a number
            and get your answer — no login, no ads.
          </p>
        </div>
      </header>

      {/* category tabs */}
      <nav className="cat-tabs" aria-label="Calculator categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`cat-tab${activeCatId === cat.id ? ' cat-tab--active' : ''}`}
            onClick={() => handleCatSelect(cat.id)}
            type="button"
          >
            {cat.label}
          </button>
        ))}
      </nav>

      {/* workspace */}
      <main className="workspace">
        {/* calculator list */}
        <aside className="calc-list">
          <p className="calc-list-heading">{activeCategory.label}</p>
          {activeCategory.calcs.map((calc) => (
            <button
              key={calc.id}
              type="button"
              className={`calc-item${activeCalcId === calc.id ? ' calc-item--active' : ''}`}
              onClick={() => setActiveCalcId(calc.id as CalcId)}
            >
              {calc.label}
            </button>
          ))}
        </aside>

        {/* calculator panel */}
        <section className="calc-panel">
          <p className="calc-panel-eyebrow">{activeCategory.label}</p>
          <h2 className="calc-panel-title">{activeCalcLabel}</h2>
          {renderCalcForm(activeCalcId)}
        </section>
      </main>

      {/* footer */}
      <footer className="calc-footer">
        <div className="calc-footer-inner">
          <p>
            <strong>DESIGNED BY ANTHONY</strong> — digital infrastructure for service businesses in
            Upstate NY.
          </p>
          <a href="https://designedbyanthony.online" className="calc-footer-link">
            See all tools →
          </a>
        </div>
      </footer>
    </div>
  );
}
