"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, getTotalCost } from "@/lib/calculations";

const emptyForm = {
  concert_name: "",
  artist: "",
  venue: "",
  city: "",
  state: "",
  concert_date: "",
  distance_from_home: "",
  hours_at_event: "",
  ticket_cost: "",
  ticket_fees: "",
  parking_cost: "",
  food_drink_cost: "",
  merchandise_cost: "",
  lodging_cost: "",
  travel_cost: "",
  other_cost: "",
  fun_rating: "7",
  notes: "",
};

function toNumber(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function ConcertForm() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const totalCost = useMemo(
    () =>
      getTotalCost({
        ticket_cost: toNumber(form.ticket_cost),
        ticket_fees: toNumber(form.ticket_fees),
        parking_cost: toNumber(form.parking_cost),
        food_drink_cost: toNumber(form.food_drink_cost),
        merchandise_cost: toNumber(form.merchandise_cost),
        lodging_cost: toNumber(form.lodging_cost),
        travel_cost: toNumber(form.travel_cost),
        other_cost: toNumber(form.other_cost),
      }),
    [form],
  );

  function update(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("You need to be logged in to save a concert.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("concerts").insert({
      user_id: user.id,
      concert_name: form.concert_name.trim(),
      artist: form.artist.trim(),
      venue: form.venue.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      concert_date: form.concert_date,
      distance_from_home: toNumber(form.distance_from_home),
      hours_at_event: toNumber(form.hours_at_event),
      ticket_cost: toNumber(form.ticket_cost),
      ticket_fees: toNumber(form.ticket_fees),
      parking_cost: toNumber(form.parking_cost),
      food_drink_cost: toNumber(form.food_drink_cost),
      merchandise_cost: toNumber(form.merchandise_cost),
      lodging_cost: toNumber(form.lodging_cost),
      travel_cost: toNumber(form.travel_cost),
      other_cost: toNumber(form.other_cost),
      fun_rating: Number(form.fun_rating),
      notes: form.notes.trim() || null,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setForm(emptyForm);
    setSuccess(true);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <h2 className="card-title font-display">Concert details</h2>
          <p className="text-sm opacity-70 -mt-1">
            The basics about the show you attended.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Concert name"
              required
              value={form.concert_name}
              onChange={(v) => update("concert_name", v)}
              placeholder="Summer Stadium Tour"
            />
            <Field
              label="Artist or band"
              required
              value={form.artist}
              onChange={(v) => update("artist", v)}
              placeholder="Artist name"
            />
            <Field
              label="Venue"
              required
              value={form.venue}
              onChange={(v) => update("venue", v)}
              placeholder="Arena or club name"
            />
            <Field
              label="City"
              required
              value={form.city}
              onChange={(v) => update("city", v)}
            />
            <Field
              label="State"
              required
              value={form.state}
              onChange={(v) => update("state", v)}
              placeholder="TX"
            />
            <Field
              label="Concert date"
              type="date"
              required
              value={form.concert_date}
              onChange={(v) => update("concert_date", v)}
            />
            <Field
              label="Distance from home (miles)"
              type="number"
              min="0"
              step="0.1"
              required
              value={form.distance_from_home}
              onChange={(v) => update("distance_from_home", v)}
              helper="How far you traveled, roughly."
            />
            <Field
              label="Hours at the event"
              type="number"
              min="0.1"
              step="0.1"
              required
              value={form.hours_at_event}
              onChange={(v) => update("hours_at_event", v)}
              helper="Used for cost per hour."
            />
            <div className="sm:col-span-2">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Notes</span>
                  <span className="label-text-alt opacity-60">Optional</span>
                </div>
                <textarea
                  className="textarea textarea-bordered h-24"
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Opening act, seats, weather, memories..."
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="card-title font-display">Costs</h2>
              <p className="text-sm opacity-70">
                Leave a field blank if it was free or you skipped it.
              </p>
            </div>
            <div className="badge badge-primary badge-lg h-auto py-2 px-3">
              Total: {formatCurrency(totalCost)}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <MoneyField
              label="Ticket cost"
              value={form.ticket_cost}
              onChange={(v) => update("ticket_cost", v)}
            />
            <MoneyField
              label="Ticket fees"
              value={form.ticket_fees}
              onChange={(v) => update("ticket_fees", v)}
            />
            <MoneyField
              label="Parking cost"
              value={form.parking_cost}
              onChange={(v) => update("parking_cost", v)}
            />
            <MoneyField
              label="Food and drink"
              value={form.food_drink_cost}
              onChange={(v) => update("food_drink_cost", v)}
            />
            <MoneyField
              label="Merchandise"
              value={form.merchandise_cost}
              onChange={(v) => update("merchandise_cost", v)}
            />
            <MoneyField
              label="Hotel or lodging"
              value={form.lodging_cost}
              onChange={(v) => update("lodging_cost", v)}
            />
            <MoneyField
              label="Travel or gas"
              value={form.travel_cost}
              onChange={(v) => update("travel_cost", v)}
            />
            <MoneyField
              label="Other cost"
              value={form.other_cost}
              onChange={(v) => update("other_cost", v)}
            />
          </div>
        </div>
      </section>

      <section className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body gap-4">
          <div>
            <h2 className="card-title font-display">Fun rating</h2>
            <p className="text-sm opacity-70">
              How much fun was this concert? 1 is terrible, 10 is the best.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <input
              type="range"
              min={1}
              max={10}
              value={form.fun_rating}
              onChange={(e) => update("fun_rating", e.target.value)}
              className="range range-primary"
              step={1}
            />
            <div className="flex justify-between text-xs opacity-70 px-1">
              <span>1 · Terrible Time</span>
              <span className="font-semibold text-base text-primary">
                {form.fun_rating} / 10
              </span>
              <span>10 · Best Time Ever</span>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div role="alert" className="alert alert-success">
          <span>Concert saved! Add another whenever you are ready.</span>
        </div>
      )}

      <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
        {loading ? "Saving..." : "Save concert"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  helper,
  min,
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  helper?: string;
  min?: string;
  step?: string;
}) {
  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text font-medium">{label}</span>
      </div>
      <input
        type={type}
        className="input input-bordered w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        min={min}
        step={step}
      />
      {helper && (
        <div className="label">
          <span className="label-text-alt opacity-60">{helper}</span>
        </div>
      )}
    </label>
  );
}

function MoneyField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text font-medium">{label}</span>
      </div>
      <label className="input input-bordered flex items-center gap-2">
        <span className="opacity-60">$</span>
        <input
          type="number"
          min="0"
          step="0.01"
          className="grow"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
        />
      </label>
    </label>
  );
}
