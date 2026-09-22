import { ChevronLeft, ChevronRight } from 'lucide-react';
interface Props { page: number; totalPages: number; total: number; limit: number; onPage: (page: number) => void; onLimit: (limit: number) => void; }
export function Pagination({ page, totalPages, total, limit, onPage, onLimit }: Props) {
	const currentPage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
	const pageLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;
	const totalItems = Number.isFinite(Number(total)) && Number(total) >= 0 ? Number(total) : 0;
	const pages = Number.isFinite(Number(totalPages)) && Number(totalPages) > 0 ? Number(totalPages) : 0;
	const firstItem = totalItems > 0 ? (currentPage - 1) * pageLimit + 1 : 0;
	const lastItem = totalItems > 0 ? Math.min(currentPage * pageLimit, totalItems) : 0;

	return <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-4 text-sm text-ink/60">
        <span>{totalItems ? `${firstItem}-${lastItem} of ${totalItems}` : 'No expenses yet'}</span>
        <div className="flex items-center gap-2">
            <select value={pageLimit} onChange={(event) => onLimit(Number(event.target.value))} className="rounded-lg border border-ink/15 bg-white px-2 py-1.5">
                <option value="5">5 / page</option>
                <option value="10">10 / page</option>
                <option value="25">25 / page</option>
            </select>
            <button aria-label="Previous page" disabled={currentPage <= 1} onClick={() => onPage(currentPage - 1)} className="rounded-lg border border-ink/15 p-2 disabled:opacity-30">
                <ChevronLeft size={16} />
            </button>
            <span className="min-w-12 text-center">
                {totalItems ? `${currentPage} / ${pages}` : '0 / 0'}
            </span>
            <button aria-label="Next page" disabled={!pages || currentPage >= pages} onClick={() => onPage(currentPage + 1)} className="rounded-lg border border-ink/15 p-2 disabled:opacity-30">
                <ChevronRight size={16} />
            </button>
        </div>
    </footer>;
}
