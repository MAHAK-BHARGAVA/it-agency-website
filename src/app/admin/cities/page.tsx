"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Edit3,
  Loader2,
  Map,
  MapPin,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

type StateItem = {
  id: number;
  name: string;
  slug: string;
};

type City = {
  id: number;
  name: string;
  slug: string;
  stateId: number | null;
};

type Tab = "cities" | "states";

export default function GeographicTargetsPage() {
  const [tab, setTab] = useState<Tab>("cities");

  const [cities, setCities] = useState<City[]>([]);
  const [states, setStates] = useState<StateItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showCityForm, setShowCityForm] = useState(false);
  const [showStateForm, setShowStateForm] = useState(false);

  const [editingCity, setEditingCity] = useState<City | null>(null);

  const [editingState, setEditingState] = useState<StateItem | null>(null);

  const [cityName, setCityName] = useState("");
  const [citySlug, setCitySlug] = useState("");
  const [cityStateId, setCityStateId] = useState("");

  const [stateName, setStateName] = useState("");
  const [stateSlug, setStateSlug] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [citiesResponse, statesResponse] = await Promise.all([
        fetch("/api/admin/cities"),
        fetch("/api/admin/states"),
      ]);

      if (!citiesResponse.ok || !statesResponse.ok) {
        throw new Error("Unable to load geographic targets.");
      }

      const [citiesData, statesData] = await Promise.all([
        citiesResponse.json(),
        statesResponse.json(),
      ]);

      setCities(citiesData);
      setStates(statesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleCityNameChange(value: string) {
    setCityName(value);

    if (!editingCity) {
      setCitySlug(generateSlug(value));
    }
  }

  function handleStateNameChange(value: string) {
    setStateName(value);

    if (!editingState) {
      setStateSlug(generateSlug(value));
    }
  }

  function openNewCity() {
    setEditingCity(null);
    setCityName("");
    setCitySlug("");
    setCityStateId("");
    setError("");
    setShowCityForm(true);
  }

  function openEditCity(city: City) {
    setEditingCity(city);
    setCityName(city.name);
    setCitySlug(city.slug);
    setCityStateId(city.stateId ? String(city.stateId) : "");
    setError("");
    setShowCityForm(true);
  }

  function closeCityForm() {
    setShowCityForm(false);
    setEditingCity(null);
  }

  function openNewState() {
    setEditingState(null);
    setStateName("");
    setStateSlug("");
    setError("");
    setShowStateForm(true);
  }

  function openEditState(state: StateItem) {
    setEditingState(state);
    setStateName(state.name);
    setStateSlug(state.slug);
    setError("");
    setShowStateForm(true);
  }

  function closeStateForm() {
    setShowStateForm(false);
    setEditingState(null);
  }

  async function saveCity(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!cityName.trim() || !citySlug.trim()) {
      setError("City name and slug are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const url = editingCity
        ? `/api/admin/cities/${editingCity.id}`
        : "/api/admin/cities";

      const response = await fetch(url, {
        method: editingCity ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: cityName.trim(),
          slug: citySlug.trim(),
          stateId: cityStateId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Unable to save city.");
      }

      closeCityForm();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save city.");
    } finally {
      setSaving(false);
    }
  }

  async function saveState(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!stateName.trim() || !stateSlug.trim()) {
      setError("State name and slug are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const url = editingState
        ? `/api/admin/states/${editingState.id}`
        : "/api/admin/states";

      const response = await fetch(url, {
        method: editingState ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: stateName.trim(),
          slug: stateSlug.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Unable to save state.");
      }

      closeStateForm();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save state.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteCity(city: City) {
    const confirmed = window.confirm(`Delete "${city.name}"?`);

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/cities/${city.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete city.");
      }

      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete city.");
    }
  }

  async function deleteState(state: StateItem) {
    const confirmed = window.confirm(`Delete "${state.name}"?`);

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/states/${state.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete state.");
      }

      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete state.");
    }
  }

  const filteredCities = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return cities;

    return cities.filter((city) => {
      const state = states.find((item) => item.id === city.stateId);

      return (
        city.name.toLowerCase().includes(query) ||
        city.slug.toLowerCase().includes(query) ||
        state?.name.toLowerCase().includes(query)
      );
    });
  }, [cities, states, search]);

  const filteredStates = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return states;

    return states.filter(
      (state) =>
        state.name.toLowerCase().includes(query) ||
        state.slug.toLowerCase().includes(query),
    );
  }, [states, search]);

  return (
    <div>
      {/* Header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-lime-600">
            SEO Targeting
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-black sm:text-4xl">
            Geographic Targets
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/50">
            Manage the states and cities used for your location-based SEO
            landing pages.
          </p>
        </div>

        <button
          type="button"
          onClick={tab === "cities" ? openNewCity : openNewState}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-bold text-white transition hover:bg-lime-400 hover:text-black"
        >
          <Plus size={17} />

          {tab === "cities" ? "Add City" : "Add State"}
        </button>
      </div>

      {/* Stats */}

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <StatCard icon={MapPin} label="Cities" value={cities.length} />

        <StatCard icon={Map} label="States" value={states.length} />
      </div>

      {/* Main Card */}

      <div className="mt-7 overflow-hidden rounded-[26px] border border-black/5 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-black/5 p-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Tabs */}

          <div className="flex rounded-xl bg-[#f4f4ef] p-1">
            <button
              type="button"
              onClick={() => {
                setTab("cities");
                setSearch("");
              }}
              className={`rounded-lg px-5 py-2 text-sm font-bold transition ${
                tab === "cities"
                  ? "bg-white text-black shadow-sm"
                  : "text-black/45 hover:text-black"
              }`}
            >
              Cities
            </button>

            <button
              type="button"
              onClick={() => {
                setTab("states");
                setSearch("");
              }}
              className={`rounded-lg px-5 py-2 text-sm font-bold transition ${
                tab === "states"
                  ? "bg-white text-black shadow-sm"
                  : "text-black/45 hover:text-black"
              }`}
            >
              States
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Search ${tab}...`}
              className="h-11 w-full rounded-xl border border-black/10 bg-[#fafaf7] pl-11 pr-4 text-sm text-[#1b1b23] outline-none transition placeholder:text-black/35 focus:border-[#6466e8] focus:ring-4 focus:ring-[#6466e8]/10"
            />
          </div>
        </div>

        {error && (
          <div className="m-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-72 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-black/40" />
          </div>
        ) : tab === "cities" ? (
          <CitiesTable
            cities={filteredCities}
            states={states}
            onEdit={openEditCity}
            onDelete={deleteCity}
          />
        ) : (
          <StatesTable
            states={filteredStates}
            cities={cities}
            onEdit={openEditState}
            onDelete={deleteState}
          />
        )}
      </div>

      {/* City modal */}

      {showCityForm && (
        <Modal
          title={editingCity ? "Edit City" : "Add City"}
          onClose={closeCityForm}
        >
          <form onSubmit={saveCity} className="space-y-5">
            <FormField label="City name">
              <input
                value={cityName}
                onChange={(event) => handleCityNameChange(event.target.value)}
                required
                className={inputClass}
                placeholder="Chandigarh"
              />
            </FormField>

            <FormField label="Slug">
              <input
                value={citySlug}
                onChange={(event) =>
                  setCitySlug(generateSlug(event.target.value))
                }
                required
                className={inputClass}
                placeholder="chandigarh"
              />
            </FormField>

            <FormField label="State">
              <select
                value={cityStateId}
                onChange={(event) => setCityStateId(event.target.value)}
                className={inputClass}
              >
                <option value="">No state selected</option>

                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </FormField>

            <ModalActions
              saving={saving}
              editing={Boolean(editingCity)}
              onCancel={closeCityForm}
            />
          </form>
        </Modal>
      )}

      {/* State modal */}

      {showStateForm && (
        <Modal
          title={editingState ? "Edit State" : "Add State"}
          onClose={closeStateForm}
        >
          <form onSubmit={saveState} className="space-y-5">
            <FormField label="State name">
              <input
                value={stateName}
                onChange={(event) => handleStateNameChange(event.target.value)}
                required
                className={inputClass}
                placeholder="Punjab"
              />
            </FormField>

            <FormField label="Slug">
              <input
                value={stateSlug}
                onChange={(event) =>
                  setStateSlug(generateSlug(event.target.value))
                }
                required
                className={inputClass}
                placeholder="punjab"
              />
            </FormField>

            <ModalActions
              saving={saving}
              editing={Boolean(editingState)}
              onCancel={closeStateForm}
            />
          </form>
        </Modal>
      )}
    </div>
  );
}

function CitiesTable({
  cities,
  states,
  onEdit,
  onDelete,
}: {
  cities: City[];
  states: StateItem[];
  onEdit: (city: City) => void;
  onDelete: (city: City) => void;
}) {
  if (cities.length === 0) {
    return <EmptyState text="No cities found." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="bg-[#fafaf7] text-left">
            <TableHead>City</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead align="right">Actions</TableHead>
          </tr>
        </thead>

        <tbody>
          {cities.map((city) => {
            const state = states.find((item) => item.id === city.stateId);

            return (
              <tr key={city.id} className="border-t border-black/5">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/5 text-black transition hover:bg-black/10">
                      <MapPin size={16} />
                    </div>

                    <span className="font-bold text-black">{city.name}</span>
                  </div>
                </td>

                <td className="px-6 py-5 text-sm text-black/55">
                  {state?.name ?? "—"}
                </td>

                <td className="px-6 py-5">
                  <code className="rounded-md bg-black/5 px-2 py-1 text-xs text-black/55">
                    {city.slug}
                  </code>
                </td>

                <td className="px-6 py-5">
                  <div className="flex justify-end gap-2">
                    <ActionButton
                      title="Edit city"
                      onClick={() => onEdit(city)}
                    >
                      <Edit3 size={15} />
                    </ActionButton>

                    <ActionButton
                      title="Delete city"
                      danger
                      onClick={() => onDelete(city)}
                    >
                      <Trash2 size={15} />
                    </ActionButton>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StatesTable({
  states,
  cities,
  onEdit,
  onDelete,
}: {
  states: StateItem[];
  cities: City[];
  onEdit: (state: StateItem) => void;
  onDelete: (state: StateItem) => void;
}) {
  if (states.length === 0) {
    return <EmptyState text="No states found." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[650px]">
        <thead>
          <tr className="bg-[#fafaf7] text-left">
            <TableHead>State</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Cities</TableHead>
            <TableHead align="right">Actions</TableHead>
          </tr>
        </thead>

        <tbody>
          {states.map((state) => {
            const cityCount = cities.filter(
              (city) => city.stateId === state.id,
            ).length;

            return (
              <tr key={state.id} className="border-t border-black/5">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                      <Building2 size={16} />
                    </div>

                    <span className="font-bold text-black">{state.name}</span>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <code className="rounded-md bg-black/5 px-2 py-1 text-xs text-black/55">
                    {state.slug}
                  </code>
                </td>

                <td className="px-6 py-5 text-sm font-semibold text-black/55">
                  {cityCount}
                </td>

                <td className="px-6 py-5">
                  <div className="flex justify-end gap-2">
                    <ActionButton
                      title="Edit state"
                      onClick={() => onEdit(state)}
                    >
                      <Edit3 size={15} />
                    </ActionButton>

                    <ActionButton
                      title="Delete state"
                      danger
                      onClick={() => onDelete(state)}
                    >
                      <Trash2 size={15} />
                    </ActionButton>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-[#1b1b23] outline-none transition placeholder:text-black/30 focus:border-[#6466e8] focus:ring-4 focus:ring-[#6466e8]/10";

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[22px] border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-black/40">{label}</p>

          <p className="mt-2 text-3xl font-black">{value}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[26px] bg-white p-6 text-[#1b1b23] shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-black">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/5 transition hover:bg-black/10"
          >
            <X size={17} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-[#1b1b23]">
        {label}
      </label>

      {children}
    </div>
  );
}

function ModalActions({
  saving,
  editing,
  onCancel,
}: {
  saving: boolean;
  editing: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="h-11 rounded-xl border border-black/10 bg-white px-5 text-sm font-bold text-[#1b1b23] transition hover:bg-black/5"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex h-11 items-center gap-2 rounded-xl bg-black px-5 text-sm font-bold text-white disabled:opacity-50"
      >
        {saving && <Loader2 size={16} className="animate-spin" />}

        {editing ? "Save Changes" : "Create"}
      </button>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  title,
  danger = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
        danger
          ? "border-red-100 text-red-500 hover:bg-red-50"
          : "border-black/10 text-black/55 hover:bg-black/5 hover:text-black"
      }`}
    >
      {children}
    </button>
  );
}

function TableHead({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-6 py-4 text-xs font-black uppercase tracking-wider text-black/35 ${
        align === "right" ? "text-right" : ""
      }`}
    >
      {children}
    </th>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="py-20 text-center">
      <MapPin className="mx-auto h-9 w-9 text-black/20" />

      <p className="mt-3 text-sm font-bold text-black/45">{text}</p>
    </div>
  );
}
