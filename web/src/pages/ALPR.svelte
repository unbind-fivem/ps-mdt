<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { alprStore } from "../stores/alprStore";

	function getTimeTranslated(time: number): string {
		const now = Date.now();
		let diffInMs = now - time;
		if (diffInMs < 0) return "Just now";
		const minutes = Math.floor(diffInMs / 60000);
		if (minutes < 1) return "Just now";
		if (minutes === 1) return "1 min ago";
		if (minutes < 60) return `${minutes} mins ago`;
		return `${Math.floor(minutes/60)} hrs ago`;
	}

    let intervalId: any;
    onMount(() => {
        // Redraw table every 30s to update the "mins ago"
        intervalId = setInterval(() => {
            $alprStore = $alprStore;
        }, 30000);
    });

    onDestroy(() => {
        if (intervalId) clearInterval(intervalId);
    });
</script>

<div class="vehicles-page">
	<div class="topbar">
		<div class="search-box">
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
			<input type="text" placeholder="Recent scans from your patrol vehicle..." disabled />
		</div>
		<button class="refresh-btn" onclick={() => { $alprStore = [] }}>
			Clear History
		</button>
	</div>

	<div class="list-panel">
		<div class="list-header">
			<span class="col-time">Time</span>
			<span class="col-plate">Plate</span>
			<span class="col-owner">Owner</span>
			<span class="col-status">Status / Alert</span>
		</div>
		<div class="list-body">
            {#if $alprStore.length === 0}
                <div class="empty-state">
                    <p>No recent scans found.</p>
                </div>
            {:else}
                {#each $alprStore as scan}
                    <div class="vehicle-row" class:is-bolo={scan.isBolo}>
                        <span class="col-time">{getTimeTranslated(scan.time)}</span>
                        <span class="col-plate mono">{scan.plate}</span>
                        <span class="col-owner">{scan.owner || "Unknown"}</span>
                        <span class="col-status">
                            {#if scan.isBolo}
                                <span class="status-pill status-bolo">BOLO: {scan.title}</span>
                            {:else}
                                <span class="status-pill status-valid">Valid</span>
                            {/if}
                        </span>
                    </div>
                {/each}
            {/if}
		</div>
	</div>
</div>

<style>
	/* ===== Page ===== */
	.vehicles-page {
		height: 100%;
		display: flex;
		flex-direction: column;
		background: var(--card-dark-bg);
		overflow: hidden;
	}

	/* ===== Topbar ===== */
	.topbar {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0 16px;
		height: 42px;
		flex-shrink: 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.search-box {
		display: flex;
		align-items: center;
		gap: 8px;
		background: transparent;
		border: none;
		padding: 0;
		flex: 1;
		max-width: 400px;
		color: rgba(255, 255, 255, 0.2);
	}

	.search-box input {
		background: transparent;
		border: none;
		color: rgba(255, 255, 255, 0.8);
		font-size: 12px;
		padding: 0;
		width: 100%;
		outline: none;
	}

	.search-box input::placeholder {
		color: rgba(255, 255, 255, 0.2);
	}

	.refresh-btn {
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 3px;
		padding: 4px 10px;
		color: rgba(255, 255, 255, 0.4);
		font-size: 10px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.1s;
		margin-left: auto;
	}

	.refresh-btn:hover {
		color: rgba(255, 255, 255, 0.7);
		border-color: rgba(255, 255, 255, 0.1);
	}

	.list-panel {
		background: transparent;
		border: none;
		border-radius: 0;
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.list-header {
		display: grid;
		grid-template-columns: 1fr 1fr 2fr 1.5fr;
		gap: 8px;
		padding: 8px 16px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.35);
		font-size: 9px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.6px;
		flex-shrink: 0;
	}

	.list-body {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 255, 255, 0.06) transparent;
	}

	.list-body::-webkit-scrollbar { width: 4px; }
	.list-body::-webkit-scrollbar-track { background: transparent; }
	.list-body::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.06); border-radius: 2px; }

	.vehicle-row {
		display: grid;
		grid-template-columns: 1fr 1fr 2fr 1.5fr;
		gap: 8px;
		padding: 7px 16px;
		align-items: center;
		border: none;
		border-bottom: 1px solid rgba(255, 255, 255, 0.03);
		background: transparent;
		transition: background 0.1s;
		width: 100%;
		text-align: left;
		font: inherit;
		color: inherit;
	}

	.vehicle-row:hover {
		background: rgba(255, 255, 255, 0.02);
	}

	.is-bolo {
		background: rgba(239, 68, 68, 0.06) !important;
	}

	.col-time {
		color: rgba(255, 255, 255, 0.5);
		font-size: 11px;
	}

	.col-owner {
		color: rgba(255, 255, 255, 0.45);
		font-size: 11px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.col-plate {
		color: rgba(255, 255, 255, 0.5);
		font-size: 11px;
	}

	.mono {
		font-family: monospace;
		letter-spacing: 0.5px;
	}

	.status-pill {
		padding: 1px 6px;
		border-radius: 3px;
		font-size: 9px;
		font-weight: 600;
		text-transform: capitalize;
		letter-spacing: 0.3px;
	}

	.status-valid {
		background: rgba(16, 185, 129, 0.08);
		color: rgba(52, 211, 153, 0.8);
		border: 1px solid rgba(16, 185, 129, 0.1);
	}

	.status-bolo {
		background: rgba(245, 158, 11, 0.08);
		color: rgba(251, 191, 36, 0.8);
		border: 1px solid rgba(245, 158, 11, 0.1);
	}

	.empty-state {
        display: flex;
        flex-direction: column;
		align-items: center;
        justify-content: center;
		padding: 30px;
		color: rgba(255, 255, 255, 0.3);
		font-size: 12px;
	}
</style>
