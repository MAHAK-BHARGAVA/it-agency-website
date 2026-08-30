"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Save,
  Search,
  MapPin,
  Building2,
  Factory,
} from "lucide-react";

import ImageUpload from "@/components/admin/uploads/ImageUpload";

type ServiceData = {
  id?: number;
  name?: string;
  slug?: string;
  description?: string;
  image?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
};

type RelatedItem = {
  id: number;
  name: string;
};

type CityItem = {
  id: number;
  name: string;
  stateId: number | null;
};

type Props = {
  initialData?: ServiceData;
};

export default function ServiceForm({
  initialData,
}: Props) {
  const router = useRouter();

  const editing = Boolean(initialData?.id);

  /* =========================================
     SERVICE CONTENT
  ========================================= */

  const [name, setName] = useState(
    initialData?.name ?? "",
  );

  const [slug, setSlug] = useState(
    initialData?.slug ?? "",
  );

  const [description, setDescription] =
    useState(initialData?.description ?? "");

  const [image, setImage] = useState(
    initialData?.image ?? "",
  );

  /* =========================================
     SEO
  ========================================= */

  const [metaTitle, setMetaTitle] = useState(
    initialData?.metaTitle ?? "",
  );

  const [metaDescription, setMetaDescription] =
    useState(
      initialData?.metaDescription ?? "",
    );

  const [canonicalUrl, setCanonicalUrl] =
    useState(
      initialData?.canonicalUrl ?? "",
    );

  const [ogImage, setOgImage] = useState(
    initialData?.ogImage ?? "",
  );

  /* =========================================
     TARGET OPTIONS
  ========================================= */

  const [cities, setCities] = useState<CityItem[]>(
    [],
  );

  const [states, setStates] = useState<
    RelatedItem[]
  >([]);

  const [industries, setIndustries] = useState<
    RelatedItem[]
  >([]);

  /* =========================================
     SELECTED TARGETS
  ========================================= */

  const [cityIds, setCityIds] = useState<
    number[]
  >([]);

  const [stateIds, setStateIds] = useState<
    number[]
  >([]);

  const [industryIds, setIndustryIds] =
    useState<number[]>([]);

  const [loadingTargets, setLoadingTargets] =
    useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* =========================================
     LOAD CITIES / STATES / INDUSTRIES
  ========================================= */

  useEffect(() => {
    async function loadTargets() {
      try {
        setLoadingTargets(true);

        const [
          citiesResponse,
          statesResponse,
          industriesResponse,
        ] = await Promise.all([
          fetch("/api/admin/cities"),
          fetch("/api/admin/states"),
          fetch("/api/admin/industries"),
        ]);

        if (
          !citiesResponse.ok ||
          !statesResponse.ok ||
          !industriesResponse.ok
        ) {
          throw new Error(
            "Unable to load service targets.",
          );
        }

        const [
          citiesData,
          statesData,
          industriesData,
        ] = await Promise.all([
          citiesResponse.json(),
          statesResponse.json(),
          industriesResponse.json(),
        ]);

        setCities(citiesData);
        setStates(statesData);
        setIndustries(industriesData);

        /* =====================================
           EDIT MODE:
           LOAD EXISTING RELATIONSHIPS
        ===================================== */

        if (initialData?.id) {
          const serviceResponse = await fetch(
            `/api/admin/services/${initialData.id}`,
          );

          const serviceData =
            await serviceResponse.json();

          if (!serviceResponse.ok) {
            throw new Error(
              serviceData.message ||
                serviceData.error ||
                "Unable to load service targets.",
            );
          }

          setCityIds(
            serviceData.serviceCities?.map(
              (item: { cityId: number }) =>
                item.cityId,
            ) ?? [],
          );

          setStateIds(
            serviceData.serviceStates?.map(
              (item: { stateId: number }) =>
                item.stateId,
            ) ?? [],
          );

          setIndustryIds(
            serviceData.serviceIndustries?.map(
              (item: {
                industryId: number;
              }) => item.industryId,
            ) ?? [],
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load service targets.",
        );
      } finally {
        setLoadingTargets(false);
      }
    }

    loadTargets();
  }, [initialData?.id]);

  /* =========================================
     REMOVE CITIES FROM UNSELECTED STATES
  ========================================= */

  useEffect(() => {
    // When no state is selected we allow all cities.
    if (stateIds.length === 0) {
      return;
    }

    const allowedCityIds = cities
      .filter(
        (city) =>
          city.stateId !== null &&
          stateIds.includes(city.stateId),
      )
      .map((city) => city.id);

    setCityIds((current) =>
      current.filter((cityId) =>
        allowedCityIds.includes(cityId),
      ),
    );
  }, [stateIds, cities]);

  /* =========================================
     FILTER CITIES BY SELECTED STATES
  ========================================= */

  const filteredCities =
    stateIds.length === 0
      ? cities
      : cities.filter(
          (city) =>
            city.stateId !== null &&
            stateIds.includes(city.stateId),
        );

  /* =========================================
     SLUG
  ========================================= */

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleNameChange(value: string) {
    setName(value);

    if (!editing) {
      setSlug(generateSlug(value));
    }
  }

  /* =========================================
     TOGGLE TARGET
  ========================================= */

  function toggleSelection(
    id: number,
    selected: number[],
    setter: React.Dispatch<
      React.SetStateAction<number[]>
    >,
  ) {
    setter((current) =>
      current.includes(id)
        ? current.filter(
            (currentId) => currentId !== id,
          )
        : [...current, id],
    );
  }

  /* =========================================
     SAVE
  ========================================= */

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Service name is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Service slug is required.");
      return;
    }

    if (!description.trim()) {
      setError(
        "Service description is required.",
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        editing
          ? `/api/admin/services/${initialData?.id}`
          : "/api/admin/services",
        {
          method: editing ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            slug: slug.trim(),
            description:
              description.trim(),

            image: image.trim() || null,

            metaTitle:
              metaTitle.trim() || null,

            metaDescription:
              metaDescription.trim() || null,

            canonicalUrl:
              canonicalUrl.trim() || null,

            ogImage:
              ogImage.trim() || null,

            /* ==========================
               RELATIONSHIPS
            ========================== */

            cityIds,
            stateIds,
            industryIds,
          }),
        },
      );

      const responseText = await response.text();

      let data: {
        message?: string;
        error?: string;
      } = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          console.error(
            "Non-JSON response from service API:",
            responseText,
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Unable to save service. Server returned ${response.status}.`,
        );
      }

      router.push("/admin/services");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save service.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================================
     UI
  ========================================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-7 xl:grid-cols-[1.15fr_0.85fr]"
    >
      {/* =====================================
          LEFT SIDE
      ====================================== */}

      <div className="min-w-0 space-y-7">
        {/* SERVICE INFO */}

        <Section
          title="Service Information"
          description="Main content displayed on the service page."
        >
          <Field label="Service name" required>
            <input
              value={name}
              onChange={(event) =>
                handleNameChange(
                  event.target.value,
                )
              }
              maxLength={150}
              placeholder="Website Design & Development"
              className={inputClass}
            />
          </Field>

          <Field label="Slug" required>
            <div className="flex overflow-hidden rounded-xl border border-black/10 bg-[#fafaf7] focus-within:border-[#6466e8] focus-within:ring-4 focus-within:ring-[#6466e8]/10">
              <span className="flex items-center border-r border-black/5 px-4 text-sm text-black/35">
                /services/
              </span>

              <input
                value={slug}
                onChange={(event) =>
                  setSlug(
                    generateSlug(
                      event.target.value,
                    ),
                  )
                }
                placeholder="website-development"
                className="h-12 min-w-0 flex-1 bg-transparent px-4 text-sm text-[#1b1b23] outline-none"
              />
            </div>
          </Field>

          <Field
            label="Description"
            required
          >
            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
              maxLength={5000}
              placeholder="Describe the service, its benefits and what your company provides..."
              className="min-h-[260px] w-full resize-y rounded-xl border border-black/10 bg-[#fafaf7] px-4 py-3 text-sm leading-7 text-[#1b1b23] outline-none transition placeholder:text-black/30 focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10"
            />

            <p className="mt-2 text-right text-xs text-black/35">
              {description.length}/5000
            </p>
          </Field>
        </Section>

        {/* SERVICE IMAGE */}

        <Section
          title="Service Image"
          description="Main visual used for this service."
        >
          <ImageUpload
            label="Service Image"
            value={image}
            onChange={setImage}
          />
        </Section>

        {/* =====================================
            TARGETING
        ====================================== */}

        <Section
          title="Service Targeting"
          description="Choose where and for which industries this service should generate targeted pages."
        >
          {loadingTargets ? (
            <div className="flex min-h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-black/30" />
            </div>
          ) : (
            <div className="space-y-7">
              {/* INDUSTRIES */}

              <TargetGroup
                title="Industries"
                icon={Factory}
                description="Industries targeted by this service."
                items={industries}
                selected={industryIds}
                onToggle={(id) =>
                  toggleSelection(
                    id,
                    industryIds,
                    setIndustryIds,
                  )
                }
              />

              {/* STATES */}

              <TargetGroup
                title="States"
                icon={Building2}
                description="States where this service is available."
                items={states}
                selected={stateIds}
                onToggle={(id) =>
                  toggleSelection(
                    id,
                    stateIds,
                    setStateIds,
                  )
                }
              />

              {/* CITIES */}

              <TargetGroup
                title="Cities"
                icon={MapPin}
                description={
                  stateIds.length > 0
                    ? "Showing cities from the selected states."
                    : "Select states to filter cities, or choose from all available cities."
                }
                items={filteredCities}
                selected={cityIds}
                onToggle={(id) =>
                  toggleSelection(
                    id,
                    cityIds,
                    setCityIds,
                  )
                }
              />
            </div>
          )}
        </Section>
      </div>

      {/* =====================================
          RIGHT SIDE
      ====================================== */}

      <div className="min-w-0 space-y-7">
        {/* SEO */}

        <Section
          title="Search Engine Optimization"
          description="Control how this service appears in search results."
        >
          <Field label="Meta title">
            <input
              value={metaTitle}
              onChange={(event) =>
                setMetaTitle(
                  event.target.value,
                )
              }
              maxLength={70}
              placeholder="Website Development Services"
              className={inputClass}
            />

            <CharacterCount
              current={metaTitle.length}
              recommended="50–60 recommended"
            />
          </Field>

          <Field label="Meta description">
            <textarea
              value={metaDescription}
              onChange={(event) =>
                setMetaDescription(
                  event.target.value,
                )
              }
              maxLength={180}
              placeholder="Professional website development services for modern businesses..."
              className="min-h-[130px] w-full resize-y rounded-xl border border-black/10 bg-[#fafaf7] px-4 py-3 text-sm leading-6 text-[#1b1b23] outline-none transition placeholder:text-black/30 focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10"
            />

            <CharacterCount
              current={
                metaDescription.length
              }
              recommended="150–160 recommended"
            />
          </Field>

          <Field label="Canonical URL">
            <input
              value={canonicalUrl}
              onChange={(event) =>
                setCanonicalUrl(
                  event.target.value,
                )
              }
              placeholder="https://example.com/services/website-development"
              className={inputClass}
            />
          </Field>

          <ImageUpload
            label="OG Image"
            value={ogImage}
            onChange={setOgImage}
          />
        </Section>

        {/* GOOGLE PREVIEW */}

        <Section
          title="Search Preview"
          description="Approximate Google search appearance."
        >
          <div className="rounded-2xl border border-black/5 bg-[#fafaf7] p-5">
            <div className="flex items-center gap-2 text-xs text-black/45">
              <Search size={14} />

              <span className="truncate">
                {canonicalUrl ||
                  (slug
                    ? `yourwebsite.com/services/${slug}`
                    : "yourwebsite.com/services/...")}
              </span>
            </div>

            <p className="mt-3 text-lg font-medium text-[#1a0dab]">
              {metaTitle ||
                name ||
                "Service Page Title"}
            </p>

            <p className="mt-2 line-clamp-3 text-sm leading-6 text-black/55">
              {metaDescription ||
                description ||
                "Your service meta description will appear here."}
            </p>
          </div>
        </Section>

        {/* SUMMARY */}

        <Section
          title="Target Summary"
          description="Current targeting selections for this service."
        >
          <div className="grid grid-cols-3 gap-3">
            <TargetCount
              label="Industries"
              value={industryIds.length}
            />

            <TargetCount
              label="States"
              value={stateIds.length}
            />

            <TargetCount
              label="Cities"
              value={cityIds.length}
            />
          </div>
        </Section>

        {/* ERROR */}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          >
            {error}
          </div>
        )}

        {/* SAVE */}

        <button
          type="submit"
          disabled={
            saving || loadingTargets
          }
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-black text-white transition hover:bg-lime-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2
                size={17}
                className="animate-spin"
              />
              Saving...
            </>
          ) : (
            <>
              <Save size={17} />

              {editing
                ? "Save Changes"
                : "Create Service"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* =========================================
   TARGET GROUP
========================================= */

function TargetGroup({
  title,
  description,
  icon: Icon,
  items,
  selected,
  onToggle,
}: {
  title: string;
  description: string;
  icon: typeof MapPin;
  items: RelatedItem[];
  selected: number[];
  onToggle: (id: number) => void;
}) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
          <Icon size={17} />
        </div>

        <div>
          <h3 className="text-sm font-black text-black">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-black/40">
            {description}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-black/10 bg-[#fafaf7] px-4 py-5 text-center text-sm text-black/40">
          No {title.toLowerCase()} available.
        </div>
      ) : (
        <div className="mt-4 grid max-h-64 gap-2 overflow-y-auto sm:grid-cols-2">
          {items.map((item) => {
            const checked =
              selected.includes(item.id);

            return (
              <label
                key={item.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                  checked
                    ? "border-lime-300 bg-lime-50"
                    : "border-black/5 bg-[#fafaf7] hover:border-black/15"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    onToggle(item.id)
                  }
                  className="h-4 w-4 shrink-0 accent-lime-500"
                />

                <span className="text-sm font-bold text-black/65">
                  {item.name}
                </span>
              </label>
            );
          })}
        </div>
      )}

      {selected.length > 0 && (
        <p className="mt-2 text-xs font-semibold text-lime-700">
          {selected.length} selected
        </p>
      )}
    </div>
  );
}

/* =========================================
   TARGET COUNT
========================================= */

function TargetCount({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-[#fafaf7] p-3 text-center">
      <p className="text-xl font-black text-black">
        {value}
      </p>

      <p className="mt-1 text-[11px] font-bold text-black/40">
        {label}
      </p>
    </div>
  );
}

/* =========================================
   SECTION
========================================= */

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-[24px] border border-black/5 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-black text-black">
        {title}
      </h2>

      <p className="mt-1 text-sm text-black/40">
        {description}
      </p>

      <div className="mt-6 space-y-5">
        {children}
      </div>
    </section>
  );
}

/* =========================================
   FIELD
========================================= */

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-[#1b1b23]">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

/* =========================================
   CHARACTER COUNT
========================================= */

function CharacterCount({
  current,
  recommended,
}: {
  current: number;
  recommended: string;
}) {
  return (
    <div className="mt-2 flex items-center justify-between text-xs text-black/35">
      <span>{recommended}</span>
      <span>{current}</span>
    </div>
  );
}

const inputClass =
  "h-12 min-w-0 w-full rounded-xl border border-black/10 bg-[#fafaf7] px-4 text-sm text-[#1b1b23] outline-none transition placeholder:text-black/30 focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10";