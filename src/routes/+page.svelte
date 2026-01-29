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
    import { optionalCategories, femaleCategories } from "$lib/types";
    import type { ExtrasCategory } from "$lib/types";
    import { defaultExtras, extraItemLabels } from "$lib/extras";

    const clothingLabels: Record<ClothingCategory, string> = {
        underwear: "Underwear",
        socks: "Socks",
        bottoms: "Bottoms",
        tees: "T-Shirts",
        jumper: "Jumper / Midlayer",
        shirts: "Shirts",
        bras: "Bras",
        dresses: "Dresses",
        skirts: "Skirts",
    };

    const outputClothingLabels: Record<OutputClothingCategory, string> = {
        underwear: "Underwear",
        socks: "Socks",
        trousers: "Trousers",
        shorts: "Shorts",
        tees: "T-Shirts",
        shirts: "Shirts",
        thinJumper: "Thin Jumper",
        thickJumper: "Thick Jumper / Midlayer",
        bras: "Bras",
        dresses: "Dresses",
        skirts: "Skirts",
    };

    const weatherOptions: { value: WeatherCondition; label: string }[] = [
        { value: "sun", label: "Sun" },
        { value: "rain", label: "Rain" },
        { value: "snow", label: "Snow" },
        { value: "wind", label: "Wind" },
    ];

    const accessoryLabels: Record<string, string> = {
        sunglasses: "Sunglasses",
        lightJacket: "Light Jacket",
        warmJacket: "Warm Jacket",
        waterproof: "Waterproof",
        hat: "Hat",
        gloves: "Gloves",
        gaitor: "Gaitor",
        thermals: "Thermals",
        sunScreen: "Sun Screen",
        insectRepellent: "Insect Repellent",
    };

    let tripName = $state("");
    let days = $state(7);
    let temperature = $state(15);
    let laundryEnabled = $state(false);
    let laundryEveryNDays = $state(7);
    let optionalEnabled = $state<Record<string, boolean>>(
        Object.fromEntries(optionalCategories.map((c) => [c, c === "shirts"])),
    );
    let femaleEnabled = $state(false);
    let extrasOpen = $state(false);
    let extras = $state<ExtrasCategory[]>(defaultExtras());
    let weather = $state<WeatherCondition[]>([]);

    let clothingRates = $state<Record<ClothingCategory, number>>({
        underwear: 1,
        socks: 1,
        bottoms: 3,
        tees: 1,
        jumper: 4,
        shirts: 3,
        bras: 2,
        dresses: 3,
        skirts: 3,
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
        optionalEnabled = Object.fromEntries(
            optionalCategories.map((c) => [c, preset.clothing[c] != null]),
        );
        clothingRates = Object.fromEntries(
            Object.entries(preset.clothing).map(([k, v]) => [
                k,
                v?.everyNDays ?? clothingRates[k as ClothingCategory],
            ]),
        ) as Record<ClothingCategory, number>;
        extras = structuredClone(preset.extras);
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
                    (optionalCategories.includes(k as ClothingCategory) &&
                        !optionalEnabled[k]) ||
                    (femaleCategories.includes(k as ClothingCategory) &&
                        !femaleEnabled)
                        ? null
                        : { everyNDays: v },
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
            <label for="trip-name">Trip name</label>
            <input id="trip-name" type="text" bind:value={tripName} />
        </div>
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
                {#if !femaleCategories.includes(key as ClothingCategory)}
                    <div class="clothing-row">
                        {#if optionalCategories.includes(key as ClothingCategory)}
                            <label class="checkbox-label" for="{key}-enabled">
                                <input
                                    id="{key}-enabled"
                                    type="checkbox"
                                    bind:checked={optionalEnabled[key]}
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
                                bind:value={
                                    clothingRates[key as ClothingCategory]
                                }
                                oninput={onClothingRateInput}
                                min="0.5"
                                max="365"
                                step="0.5"
                                disabled={optionalCategories.includes(
                                    key as ClothingCategory,
                                ) && !optionalEnabled[key]}
                            />
                            <span>days</span>
                        </div>
                    </div>
                {/if}
            {/each}
        </div>
        <label class="checkbox-label female-toggle">
            <input type="checkbox" bind:checked={femaleEnabled} />
            Women's clothing
        </label>
        {#if femaleEnabled}
            <div class="clothing-grid female-grid">
                {#each Object.entries(clothingLabels) as [key, label]}
                    {#if femaleCategories.includes(key as ClothingCategory)}
                        <div class="clothing-row">
                            <label class="checkbox-label" for="{key}-enabled">
                                <input
                                    id="{key}-enabled"
                                    type="checkbox"
                                    bind:checked={optionalEnabled[key]}
                                />
                                {label}
                            </label>
                            <div class="rate-input">
                                <span>1 every</span>
                                <input
                                    id="clothing-{key}"
                                    type="number"
                                    bind:value={
                                        clothingRates[key as ClothingCategory]
                                    }
                                    oninput={onClothingRateInput}
                                    min="0.5"
                                    max="365"
                                    step="0.5"
                                    disabled={!optionalEnabled[key]}
                                />
                                <span>days</span>
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
        {/if}
    </section>

    <section class="extras">
        <h2>
            <button
                class="expand-toggle"
                onclick={() => (extrasOpen = !extrasOpen)}
            >
                {extrasOpen ? "−" : "+"} Extras
            </button>
        </h2>
        {#if extrasOpen}
            {#each extras as category}
                <div class="extras-category">
                    <h3>{category.label}</h3>
                    <div class="extras-grid">
                        {#each Object.entries(category.items) as [key, item]}
                            <div class="extras-row">
                                <label class="checkbox-label">
                                    <input
                                        type="checkbox"
                                        bind:checked={item.enabled}
                                    />
                                    {extraItemLabels[key] ?? key}
                                </label>
                                {#if item.count != null}
                                    <input
                                        class="extras-count"
                                        type="number"
                                        bind:value={item.count}
                                        min="1"
                                        max="20"
                                        disabled={!item.enabled}
                                    />
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        {/if}
    </section>

    <section class="results" bind:this={resultsEl}>
        <h2>
            {activePreset ? `${activePreset}'s` : "Your"} Packing List{tripName
                ? ` - ${tripName}`
                : ""}
        </h2>

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

        {#each extras as category}
            {@const enabledItems = Object.entries(category.items).filter(
                ([, item]) => item.enabled,
            )}
            {#if enabledItems.length > 0}
                <div class="result-group">
                    <h3>{category.label}</h3>
                    <ul>
                        {#each enabledItems as [key, item]}
                            <li>
                                <span class="item-name"
                                    >{extraItemLabels[key] ?? key}</span
                                >
                                {#if item.count != null}
                                    <span class="item-count">{item.count}</span>
                                {:else}
                                    <span class="item-check">&#10003;</span>
                                {/if}
                            </li>
                        {/each}
                    </ul>
                </div>
            {/if}
        {/each}
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

    .field input[type="text"] {
        width: 160px;
        padding: 0.4rem 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 0.9rem;
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

    .female-toggle {
        margin-top: 0.75rem;
        padding-top: 0.75rem;
        border-top: 1px solid #e0e0e0;
    }

    .female-grid {
        margin-top: 0.5rem;
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

    .expand-toggle {
        all: unset;
        cursor: pointer;
        font-size: 1.2rem;
        font-weight: 600;
        width: 100%;
        display: block;
    }

    .extras-category {
        margin-bottom: 0.75rem;
    }

    .extras-category:last-child {
        margin-bottom: 0;
    }

    .extras-grid {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    .extras-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .extras-count {
        width: 45px;
        padding: 0.3rem 0.4rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 0.9rem;
        text-align: center;
    }

    .extras-count:disabled {
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
