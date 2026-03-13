import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const SPECIAL_PERMITS = [
  {
    code: 'SPECIAL_PERMIT_EVENTS',
    name: 'Special Permit: Events & Activities',
    description: 'Permit required for organizing public events, concerts, festivals, and other community activities within the city.',
    category: 'SPECIAL_PERMITS',
    requires_payment: true,
    default_amount: 500.00,
    form_fields: {
      fields: [
        { name: 'event_name', label: 'Event Name', type: 'text', required: true },
        { name: 'event_date', label: 'Event Date', type: 'date', required: true },
        { name: 'event_venue', label: 'Venue/Location', type: 'text', required: true },
        { name: 'expected_attendance', label: 'Expected Attendance', type: 'number', required: true },
        { name: 'organizer_name', label: 'Organizer/Organization', type: 'text', required: true },
      ]
    }
  },
  {
    code: 'SPECIAL_PERMIT_CONSTRUCTION',
    name: 'Special Permit: Construction',
    description: 'Special construction permit for projects that require additional authorization beyond standard building permits.',
    category: 'SPECIAL_PERMITS',
    requires_payment: true,
    default_amount: 1000.00,
    form_fields: {
      fields: [
        { name: 'project_name', label: 'Project Name', type: 'text', required: true },
        { name: 'project_location', label: 'Project Location', type: 'text', required: true },
        { name: 'construction_type', label: 'Type of Construction', type: 'text', required: true },
        { name: 'project_cost', label: 'Estimated Project Cost (₱)', type: 'number', required: true },
        { name: 'start_date', label: 'Estimated Start Date', type: 'date', required: true },
      ]
    }
  },
  {
    code: 'SPECIAL_PERMIT_TRANSPORT',
    name: 'Special Permit: Transport & Heavy Equipment',
    description: 'Permit for transporting oversized loads, heavy equipment, or special cargo through city roads.',
    category: 'SPECIAL_PERMITS',
    requires_payment: true,
    default_amount: 750.00,
    form_fields: {
      fields: [
        { name: 'equipment_type', label: 'Type of Equipment/Load', type: 'text', required: true },
        { name: 'route', label: 'Planned Route', type: 'text', required: true },
        { name: 'transport_date', label: 'Transport Date', type: 'date', required: true },
        { name: 'vehicle_plate', label: 'Vehicle Plate Number', type: 'text', required: true },
      ]
    }
  },
  {
    code: 'SPECIAL_PERMIT_BUSINESS_EXTENSION',
    name: 'Special Permit: Business Extension',
    description: 'Permit for businesses requesting extended operating hours or temporary expansion of business operations.',
    category: 'SPECIAL_PERMITS',
    requires_payment: true,
    default_amount: 300.00,
    form_fields: {
      fields: [
        { name: 'business_name', label: 'Business Name', type: 'text', required: true },
        { name: 'business_address', label: 'Business Address', type: 'text', required: true },
        { name: 'extension_type', label: 'Type of Extension', type: 'select', required: true, options: ['Extended Hours', 'Outdoor Operations', 'Additional Area'] },
        { name: 'reason', label: 'Reason for Extension', type: 'textarea', required: true },
      ]
    }
  },
  {
    code: 'SPECIAL_PERMIT_DEMOLITION',
    name: 'Special Permit: Demolition',
    description: 'Permit required for the demolition of structures within the city limits.',
    category: 'SPECIAL_PERMITS',
    requires_payment: true,
    default_amount: 1500.00,
    form_fields: {
      fields: [
        { name: 'structure_address', label: 'Structure Address', type: 'text', required: true },
        { name: 'structure_type', label: 'Type of Structure', type: 'text', required: true },
        { name: 'demolition_date', label: 'Planned Demolition Date', type: 'date', required: true },
        { name: 'contractor_name', label: 'Contractor Name', type: 'text', required: true },
        { name: 'reason', label: 'Reason for Demolition', type: 'textarea', required: true },
      ]
    }
  },
  {
    code: 'SPECIAL_PERMIT_EXCAVATION',
    name: 'Special Permit: Excavation & Road Cut',
    description: 'Permit for excavation works and road cutting for utility installations or repairs.',
    category: 'SPECIAL_PERMITS',
    requires_payment: true,
    default_amount: 800.00,
    form_fields: {
      fields: [
        { name: 'location', label: 'Excavation Location', type: 'text', required: true },
        { name: 'purpose', label: 'Purpose of Excavation', type: 'text', required: true },
        { name: 'depth', label: 'Depth (meters)', type: 'number', required: true },
        { name: 'start_date', label: 'Start Date', type: 'date', required: true },
        { name: 'end_date', label: 'End Date', type: 'date', required: true },
        { name: 'contractor', label: 'Contractor/Company', type: 'text', required: true },
      ]
    }
  },
]

export async function POST() {
  try {
    const supabase = createServiceClient()
    const results = []

    for (const permit of SPECIAL_PERMITS) {
      const { data: existing } = await supabase
        .from('ms_services')
        .select('id')
        .eq('code', permit.code)
        .single()

      if (existing) {
        results.push({ code: permit.code, status: 'already_exists' })
        continue
      }

      const { error } = await supabase.from('ms_services').insert(permit)
      if (error) {
        results.push({ code: permit.code, status: 'error', error: error.message })
      } else {
        results.push({ code: permit.code, status: 'inserted' })
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function GET() {
  return POST()
}
