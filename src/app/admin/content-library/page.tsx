"use client";

import { useEffect, useMemo, useState } from "react";

type TargetType = "city" | "state" | "industry";
type Mode = "list" | "add" | "edit";

type Service = {
  id: number;
  name: string;
};

type City = {
  id: number;
  name: string;
  stateId?: number | null;
};

type State = {
  id: number;
  name: string;
};

type Industry = {
  id: number;
  name: string;
};

type ContentFields = {
  metaTitle: string;
  metaDescription: string;
  heroHeading: string;
  introText: string;
};

type Combination = {
  id: number;
  serviceId: number;

  cityId?: number;
  stateId?: number;
  industryId?: number;

  metaTitle?: string | null;
  metaDescription?: string | null;
  heroHeading?: string | null;
  introText?: string | null;

  service?: {
    id: number;
    name: string;
  };

  city?: {
    id: number;
    name: string;
  };

  state?: {
    id: number;
    name: string;
  };

  industry?: {
    id: number;
    name: string;
  };
};

const emptyContent: ContentFields = {
  metaTitle: "",
  metaDescription: "",
  heroHeading: "",
  introText: "",
};

export default function ContentLibraryPage() {
  const [targetType, setTargetType] =
    useState<TargetType>("city");

  const [mode, setMode] =
    useState<Mode>("list");

  const [services, setServices] =
    useState<Service[]>([]);

  const [cities, setCities] =
    useState<City[]>([]);

  const [states, setStates] =
    useState<State[]>([]);

  const [industries, setIndustries] =
    useState<Industry[]>([]);

  const [combinations, setCombinations] =
    useState<Combination[]>([]);

  const [serviceId, setServiceId] = useState("");
  const [targetId, setTargetId] = useState("");

  const [content, setContent] =
    useState<ContentFields>(emptyContent);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingPages, setLoadingPages] =
    useState(false);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // -------------------------------------------------------
  // Current API
  // -------------------------------------------------------

  const contentApi = useMemo(() => {
    if (targetType === "city") {
      return "/api/admin/service-city";
    }

    if (targetType === "state") {
      return "/api/admin/service-state";
    }

    return "/api/admin/service-industry";
  }, [targetType]);

  // -------------------------------------------------------
  // Target options
  // -------------------------------------------------------

  const targets = useMemo(() => {
    if (targetType === "city") {
      return cities;
    }

    if (targetType === "state") {
      return states;
    }

    return industries;
  }, [targetType, cities, states, industries]);

  // -------------------------------------------------------
  // Initial data
  // -------------------------------------------------------

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        setError("");

        const [
          servicesRes,
          citiesRes,
          statesRes,
          industriesRes,
        ] = await Promise.all([
          fetch("/api/admin/services"),
          fetch("/api/admin/cities"),
          fetch("/api/admin/states"),
          fetch("/api/admin/industries"),
        ]);

        if (
          !servicesRes.ok ||
          !citiesRes.ok ||
          !statesRes.ok ||
          !industriesRes.ok
        ) {
          throw new Error(
            "Failed to load Content Library data."
          );
        }

        const [
          servicesData,
          citiesData,
          statesData,
          industriesData,
        ] = await Promise.all([
          servicesRes.json(),
          citiesRes.json(),
          statesRes.json(),
          industriesRes.json(),
        ]);

        setServices(
          Array.isArray(servicesData)
            ? servicesData
            : []
        );

        setCities(
          Array.isArray(citiesData)
            ? citiesData
            : []
        );

        setStates(
          Array.isArray(statesData)
            ? statesData
            : []
        );

        setIndustries(
          Array.isArray(industriesData)
            ? industriesData
            : []
        );
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load Content Library."
        );
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // -------------------------------------------------------
  // Load saved pages
  // -------------------------------------------------------

  async function loadPages() {
    try {
      setLoadingPages(true);
      setError("");

      const response = await fetch(contentApi);

      if (!response.ok) {
        throw new Error(
          "Failed to load saved pages."
        );
      }

      const data = await response.json();

      setCombinations(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load saved pages."
      );

      setCombinations([]);
    } finally {
      setLoadingPages(false);
    }
  }

  useEffect(() => {
    loadPages();
  }, [contentApi]);

  // -------------------------------------------------------
  // Reset when changing tab
  // -------------------------------------------------------

  useEffect(() => {
    setMode("list");
    setEditingId(null);
    setServiceId("");
    setTargetId("");
    setContent(emptyContent);
    setMessage("");
    setError("");
  }, [targetType]);

  // -------------------------------------------------------
  // Form helpers
  // -------------------------------------------------------

  function resetForm() {
    setServiceId("");
    setTargetId("");
    setEditingId(null);
    setContent(emptyContent);
    setMessage("");
    setError("");
  }

  function openAddForm() {
    resetForm();
    setMode("add");
  }

  function openEditForm(
    item: Combination
  ) {
    setEditingId(item.id);

    setServiceId(
      String(item.serviceId)
    );

    if (targetType === "city") {
      setTargetId(
        String(item.cityId ?? "")
      );
    }

    if (targetType === "state") {
      setTargetId(
        String(item.stateId ?? "")
      );
    }

    if (targetType === "industry") {
      setTargetId(
        String(item.industryId ?? "")
      );
    }

    setContent({
      metaTitle: item.metaTitle ?? "",
      metaDescription:
        item.metaDescription ?? "",
      heroHeading:
        item.heroHeading ?? "",
      introText:
        item.introText ?? "",
    });

    setMessage("");
    setError("");
    setMode("edit");
  }

  function cancelForm() {
    resetForm();
    setMode("list");
  }

  function updateField(
    field: keyof ContentFields,
    value: string
  ) {
    setContent((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // -------------------------------------------------------
  // Save / update
  // -------------------------------------------------------

  async function handleSave(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!serviceId || !targetId) {
      setError(
        "Please select both a service and target."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload: Record<
        string,
        string | number
      > = {
        serviceId: Number(serviceId),
        metaTitle: content.metaTitle,
        metaDescription:
          content.metaDescription,
        heroHeading:
          content.heroHeading,
        introText:
          content.introText,
      };

      if (targetType === "city") {
        payload.cityId =
          Number(targetId);
      }

      if (targetType === "state") {
        payload.stateId =
          Number(targetId);
      }

      if (
        targetType === "industry"
      ) {
        payload.industryId =
          Number(targetId);
      }

      const response = await fetch(
        contentApi,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const data =
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to save content."
        );
      }

      await loadPages();

      setMessage(
        mode === "edit"
          ? "Page updated successfully."
          : "Page created successfully."
      );

      setTimeout(() => {
        resetForm();
        setMode("list");
      }, 700);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save content."
      );
    } finally {
      setSaving(false);
    }
  }

  // -------------------------------------------------------
  // Delete
  // -------------------------------------------------------

  async function handleDelete(
    item: Combination
  ) {
    const targetName =
      targetType === "city"
        ? item.city?.name
        : targetType === "state"
        ? item.state?.name
        : item.industry?.name;

    const confirmed =
      window.confirm(
        `Delete ${
          item.service?.name ||
          "this service"
        } + ${
          targetName ||
          "this target"
        }?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(item.id);
      setError("");
      setMessage("");

      const payload: Record<
        string,
        number
      > = {
        serviceId:
          Number(item.serviceId),
      };

      if (targetType === "city") {
        payload.cityId =
          Number(item.cityId);
      }

      if (targetType === "state") {
        payload.stateId =
          Number(item.stateId);
      }

      if (
        targetType === "industry"
      ) {
        payload.industryId =
          Number(item.industryId);
      }

      const response = await fetch(
        contentApi,
        {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const data =
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to delete page."
        );
      }

      await loadPages();

      setMessage(
        "Page deleted successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete page."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // -------------------------------------------------------
  // Helpers
  // -------------------------------------------------------

  function getTargetName(
    item: Combination
  ) {
    if (targetType === "city") {
      return (
        item.city?.name ||
        "Unknown City"
      );
    }

    if (targetType === "state") {
      return (
        item.state?.name ||
        "Unknown State"
      );
    }

    return (
      item.industry?.name ||
      "Unknown Industry"
    );
  }

  const selectedService =
    services.find(
      (service) =>
        service.id ===
        Number(serviceId)
    );

  const selectedTarget =
    targets.find(
      (target) =>
        target.id ===
        Number(targetId)
    );

  // -------------------------------------------------------
  // Loading
  // -------------------------------------------------------

  if (loading) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-8">
          <p className="text-sm text-gray-500">
            Loading Content Library...
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">

          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
              SEO & Landing Pages
            </p>

            <h1 className="text-3xl font-bold text-gray-950">
              Content Library
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Manage targeted landing
              pages across cities,
              states and industries.
            </p>
          </div>

          {mode === "list" && (
            <button
              type="button"
              onClick={openAddForm}
              className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              + Add New Page
            </button>
          )}

        </div>

        {/* Tabs */}

        <div className="mb-8 inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">

          {(
            [
              "city",
              "state",
              "industry",
            ] as TargetType[]
          ).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() =>
                setTargetType(type)
              }
              className={`rounded-lg px-6 py-2.5 text-sm font-semibold capitalize transition ${
                targetType === type
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-black"
              }`}
            >
              {type}
            </button>
          ))}

        </div>

        {/* Messages */}

        {message && (
          <div className="mb-6 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* LIST MODE */}

        {mode === "list" && (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-100 px-6 py-5">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <h2 className="text-lg font-bold text-gray-950">
                    Existing Pages
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {combinations.length}{" "}
                    {targetType} landing
                    page
                    {combinations.length ===
                    1
                      ? ""
                      : "s"}
                  </p>
                </div>

              </div>

            </div>

            {loadingPages ? (
              <div className="p-8 text-sm text-gray-500">
                Loading pages...
              </div>
            ) : combinations.length ===
              0 ? (
              <div className="p-12 text-center">

                <h3 className="text-lg font-bold text-gray-900">
                  No pages yet
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Create your first{" "}
                  {targetType} landing
                  page.
                </p>

                <button
                  type="button"
                  onClick={openAddForm}
                  className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
                >
                  + Add New Page
                </button>

              </div>
            ) : (
              <div className="divide-y divide-gray-100">

                {combinations.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 px-6 py-5 transition hover:bg-gray-50 md:flex-row md:items-center md:justify-between"
                    >

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="text-base font-bold text-gray-950">
                            {item
                              .service
                              ?.name ||
                              "Service"}
                          </h3>

                          <span className="text-gray-300">
                            +
                          </span>

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                            {getTargetName(
                              item
                            )}
                          </span>

                        </div>

                        <p className="mt-2 truncate text-sm font-medium text-gray-700">
                          {item.metaTitle ||
                            "No page title added"}
                        </p>

                        <p className="mt-1 line-clamp-1 max-w-2xl text-sm text-gray-400">
                          {item.metaDescription ||
                            "No meta description added"}
                        </p>

                      </div>

                      <div className="flex shrink-0 items-center gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(
                              item
                            )
                          }
                          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:text-black"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              item
                            )
                          }
                          disabled={
                            deletingId ===
                            item.id
                          }
                          className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                        >
                          {deletingId ===
                          item.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>
        )}

        {/* ADD / EDIT MODE */}

        {(mode === "add" ||
          mode === "edit") && (
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">

            <form
              onSubmit={handleSave}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8"
            >

              <div className="mb-7 flex items-start justify-between gap-4">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                    {mode === "edit"
                      ? "Edit Page"
                      : "New Page"}
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-gray-950">
                    {mode === "edit"
                      ? "Update Targeted Page"
                      : "Add Targeted Page"}
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={cancelForm}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

              </div>

              {/* Selectors */}

              <div className="grid gap-5 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Service
                  </label>

                  <select
                    value={serviceId}
                    disabled={
                      mode === "edit"
                    }
                    onChange={(e) =>
                      setServiceId(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                  >

                    <option value="">
                      Select service
                    </option>

                    {services.map(
                      (service) => (
                        <option
                          key={
                            service.id
                          }
                          value={
                            service.id
                          }
                        >
                          {
                            service.name
                          }
                        </option>
                      )
                    )}

                  </select>

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700 capitalize">
                    {targetType}
                  </label>

                  <select
                    value={targetId}
                    disabled={
                      mode === "edit"
                    }
                    onChange={(e) =>
                      setTargetId(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                  >

                    <option value="">
                      Select{" "}
                      {targetType}
                    </option>

                    {targets.map(
                      (target) => (
                        <option
                          key={
                            target.id
                          }
                          value={
                            target.id
                          }
                        >
                          {
                            target.name
                          }
                        </option>
                      )
                    )}

                  </select>

                </div>

              </div>

              {/* SEO */}

              <div className="mt-8 border-t border-gray-100 pt-8">

                <h3 className="mb-5 text-base font-bold text-gray-950">
                  SEO
                </h3>

                <div className="space-y-5">

                  <div>

                    <div className="mb-2 flex items-center justify-between">

                      <label className="text-sm font-semibold text-gray-700">
                        Page Title
                      </label>

                      <span className="text-xs text-gray-400">
                        {
                          content
                            .metaTitle
                            .length
                        }
                        /60
                      </span>

                    </div>

                    <input
                      type="text"
                      value={
                        content.metaTitle
                      }
                      onChange={(e) =>
                        updateField(
                          "metaTitle",
                          e.target.value
                        )
                      }
                      placeholder="Web Development Company in Jaipur"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-500"
                    />

                  </div>

                  <div>

                    <div className="mb-2 flex items-center justify-between">

                      <label className="text-sm font-semibold text-gray-700">
                        Meta Description
                      </label>

                      <span className="text-xs text-gray-400">
                        {
                          content
                            .metaDescription
                            .length
                        }
                        /160
                      </span>

                    </div>

                    <textarea
                      rows={3}
                      value={
                        content.metaDescription
                      }
                      onChange={(e) =>
                        updateField(
                          "metaDescription",
                          e.target.value
                        )
                      }
                      placeholder="Write a concise search description..."
                      className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 outline-none focus:border-gray-500"
                    />

                  </div>

                </div>

              </div>

              {/* Content */}

              <div className="mt-8 border-t border-gray-100 pt-8">

                <h3 className="mb-5 text-base font-bold text-gray-950">
                  Landing Page
                  Content
                </h3>

                <div className="space-y-5">

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Hero Heading
                    </label>

                    <input
                      type="text"
                      value={
                        content.heroHeading
                      }
                      onChange={(e) =>
                        updateField(
                          "heroHeading",
                          e.target.value
                        )
                      }
                      placeholder="Website Development Services in Jaipur"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-500"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Introduction
                      Text
                    </label>

                    <textarea
                      rows={8}
                      value={
                        content.introText
                      }
                      onChange={(e) =>
                        updateField(
                          "introText",
                          e.target.value
                        )
                      }
                      placeholder="Write the introduction for this targeted landing page..."
                      className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm leading-7 outline-none focus:border-gray-500"
                    />

                  </div>

                </div>

              </div>

              {error && (
                <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  saving ||
                  !serviceId ||
                  !targetId
                }
                className="mt-7 min-w-44 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving
                  ? mode === "edit"
                    ? "Updating..."
                    : "Saving..."
                  : mode === "edit"
                  ? "Update Page"
                  : "Save Page"}
              </button>

            </form>

            {/* Preview */}

            <div className="self-start xl:sticky xl:top-8">

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                  Search Preview
                </p>

                <h2 className="mt-1 text-lg font-bold text-gray-950">
                  Google SERP
                </h2>

                <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-5">

                  <p className="mb-1 truncate text-sm text-gray-700">
                    {selectedService?.name ||
                      "Your Service"}
                    {" › "}
                    {selectedTarget?.name ||
                      targetType}
                  </p>

                  <p className="text-xl font-medium leading-7 text-blue-700">
                    {content.metaTitle ||
                      `${
                        selectedService?.name ||
                        "Service"
                      } in ${
                        selectedTarget?.name ||
                        "Target"
                      }`}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {content.metaDescription ||
                      "Your meta description will appear here."}
                  </p>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}