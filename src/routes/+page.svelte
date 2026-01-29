<script lang="ts">
    import { toJpeg } from "html-to-image";
    import { calculatePackingList } from "$lib/calculator";
    import { presets } from "$lib/presets";
    import type {
        ClothingCategory,
        OutputClothingCategory,
        WeatherCondition,
        TripConfig,
    } from "$lib/types";

    const clothingLabels: Record<ClothingCategory, string> = {
        pants: "Pants",
        socks: "Socks",
        bottoms: "Bottoms",
        tees: "T-Shirts",
        jumper: "Jumper / Midlayer",
        shirts: "Shirts",
    };

    const outputClothingLabels: Record<OutputClothingCategory, string> = {
        pants: "Pants",
        socks: "Socks",
        trousers: "Trousers",
        shorts: "Shorts",
        tees: "T-Shirts",
        shirts: "Shirts",
        thinJumper: "Thin Jumper",
        thickJumper: "Thick Jumper / Midlayer",
    };

    const weatherOptions: { value: WeatherCondition; label: string }[] = [
        { value: "sun", label: "Sun" },
        { value: "cloud", label: "Cloud" },
        { value: "rain", label: "Rain" },
        { value: "storm", label: "Storm" },
        { value: "snow", label: "Snow" },
        { value: "wind", label: "Wind" },
    ];

    const accessoryLabels: Record<string, string> = {
        sunglasses: "Sunglasses",
        jacket: "Jacket",
        waterproof: "Waterproof",
        hat: "Hat",
        gloves: "Gloves",
        gaitor: "Gaitor",
        thermals: "Thermals",
    };

    let days = $state(7);
    let temperature = $state(15);
    let laundryEnabled = $state(true);
    let laundryEveryNDays = $state(7);
    let shirtsEnabled = $state(true);
    let weather = $state<WeatherCondition[]>(["sun", "cloud"]);

    let clothingRates = $state<Record<ClothingCategory, number>>({
        pants: 1,
        socks: 1,
        bottoms: 3,
        tees: 1,
        shirts: 3,
        jumper: 4,
    });

    function toggleWeather(condition: WeatherCondition) {
        if (weather.includes(condition)) {
            weather = weather.filter((w) => w !== condition);
        } else {
            weather = [...weather, condition];
        }
    }

    let activePreset = $state<string | null>(null);

    function applyPreset(presetName: string) {
        const preset = presets.find((p) => p.name === presetName);
        if (!preset) return;
        activePreset = presetName;
        shirtsEnabled = preset.clothing.shirts != null;
        clothingRates = Object.fromEntries(
            Object.entries(preset.clothing).map(([k, v]) => [
                k,
                v?.everyNDays ?? 3,
            ]),
        ) as Record<ClothingCategory, number>;
    }

    function onClothingRateInput() {
        activePreset = null;
    }

    let packingList = $derived.by(() => {
        const config: TripConfig = {
            days,
            temperature,
            weather,
            laundryEveryNDays: laundryEnabled ? laundryEveryNDays : null,
            clothing: Object.fromEntries(
                Object.entries(clothingRates).map(([k, v]) => [
                    k,
                    k === "shirts" && !shirtsEnabled ? null : { everyNDays: v },
                ]),
            ) as TripConfig["clothing"],
        };
        return calculatePackingList(config);
    });

    let resultsEl: HTMLElement;

    async function saveAsJpg() {
        const dataUrl = await toJpeg(resultsEl, {
            backgroundColor: "#f5f5f5",
            quality: 0.95,
        });
        const link = document.createElement("a");
        link.download = "packing-list.jpg";
        link.href = dataUrl;
        link.click();
    }
</script>

<main>
    <h1>Packing List Calculator</h1>

    <section class="presets">
        <h2>Presets</h2>
        <div class="preset-buttons">
            {#each presets as preset}
                <button onclick={() => applyPreset(preset.name)}
                    >{preset.name}</button
                >
            {/each}
        </div>
    </section>

    <section class="trip-details">
        <h2>Trip Details</h2>
        <div class="field">
            <label for="days">Trip length (days)</label>
            <input
                id="days"
                type="number"
                bind:value={days}
                min="1"
                max="365"
            />
        </div>
        <div class="field">
            <label for="temperature">Average daytime temperature (&deg;C)</label
            >
            <input
                id="temperature"
                type="number"
                bind:value={temperature}
                min="-30"
                max="50"
            />
        </div>
        <div class="field">
            <label class="checkbox-label" for="laundry-enabled">
                <input
                    id="laundry-enabled"
                    type="checkbox"
                    bind:checked={laundryEnabled}
                />
                Laundry every
            </label>
            <input
                id="laundry"
                type="number"
                bind:value={laundryEveryNDays}
                min="1"
                max="365"
                disabled={!laundryEnabled}
            />
            <span class="field-suffix">days</span>
        </div>
    </section>

    <section class="weather">
        <h2>Weather Conditions</h2>
        <div class="checkbox-group">
            {#each weatherOptions as opt}
                <label class="checkbox-label">
                    <input
                        type="checkbox"
                        checked={weather.includes(opt.value)}
                        onchange={() => toggleWeather(opt.value)}
                    />
                    {opt.label}
                </label>
            {/each}
        </div>
    </section>

    <section class="clothing">
        <h2>Clothing</h2>
        <p class="hint">1 item every N days</p>
        <div class="clothing-grid">
            {#each Object.entries(clothingLabels) as [key, label]}
                <div class="clothing-row">
                    {#if key === "shirts"}
                        <label class="checkbox-label" for="shirts-enabled">
                            <input
                                id="shirts-enabled"
                                type="checkbox"
                                bind:checked={shirtsEnabled}
                            />
                            {label}
                        </label>
                    {:else}
                        <label for="clothing-{key}">{label}</label>
                    {/if}
                    <div class="rate-input">
                        <span>1 every</span>
                        <input
                            id="clothing-{key}"
                            type="number"
                            bind:value={clothingRates[key as ClothingCategory]}
                            oninput={onClothingRateInput}
                            min="0.5"
                            max="365"
                            step="0.5"
                            disabled={key === "shirts" && !shirtsEnabled}
                        />
                        <span>days</span>
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <section class="results" bind:this={resultsEl}>
        <h2>{activePreset ? `${activePreset}'s` : "Your"} Packing List</h2>

        <div class="result-group">
            <h3>Clothing</h3>
            <ul>
                {#each Object.entries(packingList.clothing) as [key, count]}
                    {#if count > 0}
                        <li>
                            <span class="item-name"
                                >{outputClothingLabels[
                                    key as OutputClothingCategory
                                ]}</span
                            >
                            <span class="item-count">{count}</span>
                        </li>
                    {/if}
                {/each}
            </ul>
        </div>

        <div class="result-group">
            <h3>Accessories</h3>
            <ul>
                {#each Object.entries(packingList.accessories) as [key, needed]}
                    {#if needed}
                        <li>
                            <span class="item-name">{accessoryLabels[key]}</span
                            >
                            <span class="item-check">&#10003;</span>
                        </li>
                    {/if}
                {/each}
                {#if !Object.values(packingList.accessories).some(Boolean)}
                    <li class="none">None needed</li>
                {/if}
            </ul>
        </div>
    </section>

    <button class="save-btn" onclick={saveAsJpg}>Save as JPG</button>
</main>

<style>
    :global(body) {
        margin: 0;
        font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: #f5f5f5;
        color: #1a1a1a;
    }

    main {
        max-width: 640px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    h1 {
        font-size: 1.8rem;
        margin-bottom: 1.5rem;
    }

    h2 {
        font-size: 1.2rem;
        margin-bottom: 0.75rem;
        border-bottom: 2px solid #e0e0e0;
        padding-bottom: 0.25rem;
    }

    h3 {
        font-size: 1rem;
        margin-bottom: 0.5rem;
    }

    section {
        background: white;
        border-radius: 8px;
        padding: 1.25rem;
        margin-bottom: 1rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    .preset-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .preset-buttons button {
        padding: 0.5rem 1.25rem;
        border: 1px solid #ccc;
        border-radius: 6px;
        background: #fafafa;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background 0.15s;
    }

    .preset-buttons button:hover {
        background: #e8e8e8;
    }

    .field {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 0.75rem;
    }

    .field label {
        flex: 1;
        font-size: 0.9rem;
    }

    .field input[type="number"] {
        width: 80px;
        padding: 0.4rem 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 0.9rem;
        text-align: center;
    }

    .field input:disabled {
        opacity: 0.4;
    }

    .field-suffix {
        font-size: 0.9rem;
        color: #555;
    }

    .checkbox-group {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.9rem;
        cursor: pointer;
    }

    .hint {
        font-size: 0.8rem;
        color: #888;
        margin-bottom: 0.75rem;
    }

    .clothing-grid {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .clothing-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    .clothing-row label {
        flex: 1;
        font-size: 0.9rem;
    }

    .rate-input {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.85rem;
        color: #555;
    }

    .rate-input input {
        width: 50px;
        padding: 0.35rem 0.4rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 0.9rem;
        text-align: center;
    }

    .rate-input input:disabled {
        opacity: 0.4;
    }

    .results {
        background: #f0f7ff;
        border: 1px solid #c0d8f0;
    }

    .save-btn {
        display: block;
        width: 100%;
        padding: 0.65rem;
        border: 1px solid #ccc;
        border-radius: 6px;
        background: #fafafa;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background 0.15s;
    }

    .save-btn:hover {
        background: #e8e8e8;
    }

    .result-group {
        margin-bottom: 1rem;
    }

    .result-group:last-child {
        margin-bottom: 0;
    }

    .result-group ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .result-group li {
        display: flex;
        justify-content: space-between;
        padding: 0.35rem 0;
        border-bottom: 1px solid #dce8f2;
        font-size: 0.9rem;
    }

    .result-group li:last-child {
        border-bottom: none;
    }

    .item-count {
        font-weight: 600;
        min-width: 2rem;
        text-align: right;
    }

    .item-check {
        color: #2a7d2a;
        font-weight: 600;
    }

    .none {
        color: #888;
        font-style: italic;
    }
</style>
