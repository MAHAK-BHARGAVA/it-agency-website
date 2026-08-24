"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

type Service = {
  id: number;
  name: string;
};

type Industry = {
  id: number;
  name: string;
};

type Portfolio = {
  id: number;
  projectName: string;
  slug: string;
  thumbnail: string | null;
  resultSummary: string;
  clientName: string | null;
  projectUrl: string | null;
  services: Service[];
  industries: Industry[];
  createdAt: string;
};

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<Portfolio[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/portfolio");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to load portfolio.",
        );
      }

      setProjects(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load portfolio.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(project: Portfolio) {
    const confirmed = window.confirm(
      `Delete "${project.projectName}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(project.id);
      setError("");

      const response = await fetch(
        `/api/admin/portfolio/${project.id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to delete project.",
        );
      }

      setProjects((current) =>
        current.filter((item) => item.id !== project.id),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete project.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const filteredProjects = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return projects;

    return projects.filter((project) => {
      return (
        project.projectName.toLowerCase().includes(query) ||
        project.clientName?.toLowerCase().includes(query) ||
        project.services.some((service) =>
          service.name.toLowerCase().includes(query),
        ) ||
        project.industries.some((industry) =>
          industry.name.toLowerCase().includes(query),
        )
      );
    });
  }, [projects, search]);

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-lime-600">
            Content Management
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-black sm:text-4xl">
            Portfolio
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/50">
            Manage client projects, case studies, services delivered and
            industry associations.
          </p>
        </div>

        <Link
          href="/admin/portfolio/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-bold text-white transition hover:bg-lime-400 hover:text-black"
        >
          <Plus size={17} />
          Add Project
        </Link>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Total Projects"
          value={projects.length}
          icon={ImageIcon}
        />

        <StatCard
          label="Live Projects"
          value={projects.filter((project) => project.projectUrl).length}
          icon={ExternalLink}
        />
      </div>

      <div className="mt-7 overflow-hidden rounded-[26px] border border-black/5 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-black/5 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-black text-black">
              All Projects
            </h2>

            <p className="mt-1 text-sm text-black/40">
              {filteredProjects.length} project
              {filteredProjects.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects..."
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
        ) : filteredProjects.length === 0 ? (
          <EmptyState hasSearch={Boolean(search)} />
        ) : (
          <div className="grid gap-5 p-5 md:grid-cols-2 2xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                deleting={deletingId === project.id}
                onDelete={() => handleDelete(project)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  deleting,
  onDelete,
}: {
  project: Portfolio;
  deleting: boolean;
  onDelete: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-[22px] border border-black/5 bg-[#fafaf7] transition hover:-translate-y-1 hover:bg-white hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-black/5">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.projectName}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon className="h-10 w-10 text-black/15" />
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-black">
              {project.projectName}
            </h3>

            <p className="mt-1 text-sm text-black/40">
              {project.clientName ?? "No client name"}
            </p>
          </div>

          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noreferrer"
              title="Open live project"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white text-black/55 transition hover:bg-black hover:text-white"
            >
              <ExternalLink size={15} />
            </a>
          )}
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-black/55">
          {project.resultSummary}
        </p>

        {project.services.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.services.slice(0, 3).map((service) => (
              <span
                key={service.id}
                className="rounded-full bg-lime-100 px-3 py-1 text-[11px] font-bold text-lime-800"
              >
                {service.name}
              </span>
            ))}

            {project.services.length > 3 && (
              <span className="rounded-full bg-black/5 px-3 py-1 text-[11px] font-bold text-black/45">
                +{project.services.length - 3}
              </span>
            )}
          </div>
        )}

        {project.industries.length > 0 && (
          <p className="mt-4 text-xs font-semibold text-black/40">
            Industry:{" "}
            {project.industries.map((item) => item.name).join(", ")}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
          <code className="max-w-[55%] truncate rounded-md bg-black/5 px-2 py-1 text-[11px] text-black/45">
            {project.slug}
          </code>

          <div className="flex gap-2">
            <Link
              href={`/admin/portfolio/${project.id}/edit`}
              title="Edit project"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white text-black/55 transition hover:bg-black/5 hover:text-black"
            >
              <Pencil size={15} />
            </Link>

            <button
              type="button"
              title="Delete project"
              disabled={deleting}
              onClick={onDelete}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:bg-red-50 disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Trash2 size={15} />
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof ImageIcon;
}) {
  return (
    <div className="rounded-[22px] border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-black/40">
            {label}
          </p>

          <p className="mt-2 text-3xl font-black text-black">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  hasSearch,
}: {
  hasSearch: boolean;
}) {
  return (
    <div className="py-20 text-center">
      <ImageIcon className="mx-auto h-10 w-10 text-black/15" />

      <p className="mt-4 text-sm font-bold text-black/45">
        {hasSearch
          ? "No projects match your search."
          : "No portfolio projects yet."}
      </p>

      {!hasSearch && (
        <Link
          href="/admin/portfolio/new"
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-black px-4 text-sm font-bold text-white"
        >
          <Plus size={15} />
          Add your first project
        </Link>
      )}
    </div>
  );
}