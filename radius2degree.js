document.addEventListener("DOMContentLoaded", function () {
    // https://stackoverflow.com/a/79490464
    let radio_objects = document.querySelectorAll("input[type='radio'][name=gageType]");
    for (let i = 0; i < radio_objects.length; i++) {
        radio_objects[i].addEventListener('click', function () {
            document.getElementById(this.name).dataset.value = this.value;
        });
    }

    const panelTypeSelect = document.getElementById("panelType");
    const gageTypeElement = document.getElementById("gageType");
    const gageTypeInput = gageTypeElement.dataset.value;
    const panelLengthInput = document.getElementById("panelLength");
    const gageWidthInput = document.getElementById("gageWidth");
    const fieldWidthInput = document.getElementById("fieldWidth");
    const railSizeSelect = document.getElementById("railSize");
    const fieldRubberWidthInput = document.getElementById("fieldRubberWidth");
    const railHeadWidthInput = document.getElementById("railHeadWidth");
    const gageRubberWidthInput = document.getElementById("gageRubberWidth");
    const compareColumnToggle = document.getElementById("compareColumnToggle");
    const compareColumn = document.getElementById("compareColumn");
    const calculationsRow = compareColumn.parentElement; // The row.g-5 container

    // Auto-managed field indicators
    const panelTypeBadge = document.getElementById("panelType-badge");
    const panelTypeReset = document.getElementById("panelType-reset");
    const panelLengthBadge = document.getElementById("panelLength-badge");
    const panelLengthReset = document.getElementById("panelLength-reset");
    const gageWidthBadge = document.getElementById("gageWidth-badge");
    const gageWidthReset = document.getElementById("gageWidth-reset");
    const fieldWidthBadge = document.getElementById("fieldWidth-badge");
    const fieldWidthReset = document.getElementById("fieldWidth-reset");
    const railSizeBadge = document.getElementById("railSize-badge");
    const railSizeReset = document.getElementById("railSize-reset");
    const fieldRubberWidthBadge = document.getElementById("fieldRubberWidth-badge");
    const fieldRubberWidthReset = document.getElementById("fieldRubberWidth-reset");
    const railHeadWidthBadge = document.getElementById("railHeadWidth-badge");
    const railHeadWidthReset = document.getElementById("railHeadWidth-reset");
    const gageRubberWidthBadge = document.getElementById("gageRubberWidth-badge");
    const gageRubberWidthReset = document.getElementById("gageRubberWidth-reset");

    const measuredElements = {
        "degree": document.getElementById("degreeOfCurve"),
        "rise": document.getElementById("measuredRise"),
        "highRadius": document.getElementById("highRadius"),
        "centerRadius": document.getElementById("centerRadius"),
        "lowRadius": document.getElementById("lowRadius"),
        "r6": {
            "radius": document.getElementById("measured-r6-radius"),
            "chord": document.getElementById("measured-r6-chord"),
            "arcLength": document.getElementById("measured-r6-arc"),
            "cutLength": document.getElementById("measured-r6-cut")
        },
        "r5": {
            "radius": document.getElementById("measured-r5-radius"),
            "chord": document.getElementById("measured-r5-chord"),
            "arcLength": document.getElementById("measured-r5-arc"),
            "cutLength": document.getElementById("measured-r5-cut")
        },
        "r4": {
            "radius": document.getElementById("measured-r4-radius"),
            "chord": document.getElementById("measured-r4-chord"),
            "arcLength": document.getElementById("measured-r4-arc"),
            "cutLength": document.getElementById("measured-r4-cut")
        },
        "r3": {
            "radius": document.getElementById("measured-r3-radius"),
            "chord": document.getElementById("measured-r3-chord"),
            "arcLength": document.getElementById("measured-r3-arc"),
            "cutLength": document.getElementById("measured-r3-cut")
        },
        "r2": {
            "radius": document.getElementById("measured-r2-radius"),
            "chord": document.getElementById("measured-r2-chord"),
            "arcLength": document.getElementById("measured-r2-arc"),
            "cutLength": document.getElementById("measured-r2-cut")
        },
        "r1": {
            "radius": document.getElementById("measured-r1-radius"),
            "chord": document.getElementById("measured-r1-chord"),
            "arcLength": document.getElementById("measured-r1-arc"),
            "cutLength": document.getElementById("measured-r1-cut")
        }
    };

    const measuredValues = {
        "degree": "",
        "rise": "",
        "highRadius": "",
        "centerRadius": "",
        "lowRadius": "",
        "r6": {
            "radius": "",
            "chord": "",
            "arcLength": "",
            "cutLength": ""
        },
        "r5": {
            "radius": "",
            "chord": "",
            "arcLength": "",
            "cutLength": ""
        },
        "r4": {
            "radius": "",
            "chord": "",
            "arcLength": "",
            "cutLength": ""
        },
        "r3": {
            "radius": "",
            "chord": "",
            "arcLength": "",
            "cutLength": ""
        },
        "r2": {
            "radius": "",
            "chord": "",
            "arcLength": "",
            "cutLength": ""
        },
        "r1": {
            "radius": "",
            "chord": "",
            "arcLength": "",
            "cutLength": ""
        }
    };

    
    const compareElements = {
        "degree": document.getElementById("compare-degreeOfCurve"),
        "rise": document.getElementById("compare-Rise"),
        "highRadius": document.getElementById("compare-highRadius"),
        "centerRadius": document.getElementById("compare-centerRadius"),
        "lowRadius": document.getElementById("compare-lowRadius"),
        "r6": {
            "radius": document.getElementById("compare-r6-radius"),
            "chord": document.getElementById("compare-r6-chord"),
            "arcLength": document.getElementById("compare-r6-arc"),
            "cutLength": document.getElementById("compare-r6-cut"),
            "spec": document.getElementById("compare-r6-spec")
        },
        "r5": {
            "radius": document.getElementById("compare-r5-radius"),
            "chord": document.getElementById("compare-r5-chord"),
            "arcLength": document.getElementById("compare-r5-arc"),
            "cutLength": document.getElementById("compare-r5-cut"),
            "spec": document.getElementById("compare-r5-spec")
        },
        "r4": {
            "radius": document.getElementById("compare-r4-radius"),
            "chord": document.getElementById("compare-r4-chord"),
            "arcLength": document.getElementById("compare-r4-arc"),
            "cutLength": document.getElementById("compare-r4-cut"),
            "spec": document.getElementById("compare-r4-spec")
        },
        "r3": {
            "radius": document.getElementById("compare-r3-radius"),
            "chord": document.getElementById("compare-r3-chord"),
            "arcLength": document.getElementById("compare-r3-arc"),
            "cutLength": document.getElementById("compare-r3-cut"),
            "spec": document.getElementById("compare-r3-spec")
        },
        "r2": {
            "radius": document.getElementById("compare-r2-radius"),
            "chord": document.getElementById("compare-r2-chord"),
            "arcLength": document.getElementById("compare-r2-arc"),
            "cutLength": document.getElementById("compare-r2-cut"),
            "spec": document.getElementById("compare-r2-spec")
        },
        "r1": {
            "radius": document.getElementById("compare-r1-radius"),
            "chord": document.getElementById("compare-r1-chord"),
            "arcLength": document.getElementById("compare-r1-arc"),
            "cutLength": document.getElementById("compare-r1-cut"),
            "spec": document.getElementById("compare-r1-spec")
        }
    };

    const compareValues = {
        "degree": "",
        "rise": "",
        "highRadius": "",
        "centerRadius": "",
        "lowRadius": "",
        "r6": {
            "radius": "",
            "chord": "",
            "arcLength": "",
            "cutLength": ""
        },
        "r5": {
            "radius": "",
            "chord": "",
            "arcLength": "",
            "cutLength": ""
        },
        "r4": {
            "radius": "",
            "chord": "",
            "arcLength": "",
            "cutLength": ""
        },
        "r3": {
            "radius": "",
            "chord": "",
            "arcLength": "",
            "cutLength": ""
        },
        "r2": {
            "radius": "",
            "chord": "",
            "arcLength": "",
            "cutLength": ""
        },
        "r1": {
            "radius": "",
            "chord": "",
            "arcLength": "",
            "cutLength": ""
        }
    };



    // Auto-managed field state tracking
    var autoManagedFields = {
        panelType: true,
        gageType: true,
        panelLength: true,
        gageWidth: true,
        fieldWidth: true,
        railSize: true,
        fieldRubberWidth: true,
        railHeadWidth: true,
        gageRubberWidth: true
    };

    // Store current panel defaults for comparison
    var currentPanelDefaults = {
        gageType: null,
        panelLength: null,
        gageWidth: null,
        fieldWidth: null,
        railSize: null,
        fieldRubberWidth: null,
        railHeadWidth: null,
        gageRubberWidth: null
    };

    var theta = 0; // Initialize theta variable
    var isCompareColumnVisible = false; // Default hidden


    // Rail Head Widths
    const railHeadWidths = {
        "90": (2 + 9 / 16) / 12,
        "110": (2 + 5 / 8) / 12,
        "115": (2 + 11 / 16) / 12,
        "119": (2 + 5 / 8) / 12,
        "132": (2 + 15 / 16) / 12,
        "133": (2 + 7 / 8) / 12,
        "136": (2 + 7 / 8) / 12,
        "140": (2 + 15 / 16) / 12,
        "141": (3) / 12
    };

    // Populate the select element with rail sizes
    buildRailSizeSelectOptions();
    setRailSize("133"); // Set default rail size

    function buildRailSizeSelectOptions() {
        const railSizeOptions = Object.keys(railHeadWidths).map(size => {
            return `<option value="${size}">#${size}</option>`;
        }).join('');
        railSizeSelect.innerHTML = railSizeOptions;
    }

    function getRailSize() {
        return railSizeSelect.value;
    }

    function setRailSize(railSize) {
        // Check if the rail size exists in the options
        const optionExists = Array.from(railSizeSelect.options).some(option => option.value === railSize);
        if (optionExists) {
            railSizeSelect.value = railSize;
            setRailHeadWidth(railSize);
        }
        else {
            console.warn(`Rail size ${railSize} does not exist in the options.`);
        }
    }

    function getRailHeadWidth() {
        return railHeadWidthInput.value ? parseFloat(railHeadWidthInput.value) : 0;
    }

    function setRailHeadWidth(railSize) {
        railHeadWidthInput.value = railHeadWidths[railSize].toFixed(3);
    }


    // function updateRailHeadWidth() {
    //     const selectedSize = railSizeSelect.value;
    //     const railHeadWidth = railHeadWidths[selectedSize] || 0;
    //     railHeadWidthInput.value = railHeadWidth.toFixed(3);

    //     railSizeModified = false;
    // }

    // Set initial rail head width based on default rail size
    // updateRailHeadWidth();

    // Panel Type Defaults
    const panelDefaults = {
        "0201": {
        },
        "0202": {
        },
        "1301": {
            "gageType": "standard",
            "panelLength": 8.125,
            "gageWidth": 50.50 / 12,
            "fieldWidth": 27 / 12,
            "railSize": "133",
            "fieldRubberWidth": 2.5 / 12,
            "railHeadWidth": 3 / 12,
            "gageRubberWidth": 3 / 12
        },
        "1310": {
            "gageType": "pedestrian",
            "panelLength": 10,
            "gageWidth": 51.50 / 12,
            "fieldWidth": 18 / 12,
            "railSize": "115",
            "fieldRubberWidth": 2.5 / 12,
            "railHeadWidth": (2 + 11 / 16) / 12,
            "gageRubberWidth": 2.5 / 12
        },
        "1315": {
        }
        // Add other panel types here
    };


    // Panel Type
    function buildPanelTypeSelectOptions() {
        const panelTypeOptions = Object.keys(panelDefaults).map(type => {
            return `<option value="${type}">${type}</option>`;
        }).join('');
        panelTypeSelect.innerHTML = panelTypeOptions;
    }

    buildPanelTypeSelectOptions();

    function getPanelType() {
        return panelTypeSelect.value;
    }

    function setPanelType(panelType) {
        // Check if the panel type exists in the options
        const optionExists = Array.from(panelTypeSelect.options).some(option => option.value === panelType);
        if (optionExists) {
            panelTypeSelect.value = panelType;
            setPanelTypeDefaults(panelType);
        } else {
            console.warn(`Panel type ${panelType} does not exist in the options.`);
        }
    }


    // Gage Type
    function getGageType() {
        return gageTypeElement.dataset.value || "standard";
    }

    function setGageType(gageType) {
        // Check if the gage type is a valid value
        const validGageTypes = ["standard", "pedestrian"];
        if (validGageTypes.includes(gageType)) {
            gageTypeElement.dataset.value = gageType;
            const gageRadio = document.querySelector(`input[type='radio'][name='gageType'][value='${gageType}']`);
            if (gageRadio) {
                gageRadio.checked = true;
            } else {
                console.warn(`Gage type radio button for ${gageType} not found.`);
            }
            setGageWidth(gageType);
        } else {
            console.warn(`Invalid gage type: ${gageType}`);
        }
    }

    function getPanelLength() {
        return panelLengthInput.value ? parseFloat(panelLengthInput.value) : 0;
    }

    function setPanelLength(panelLength) {
        // Check if the panel length is a valid number
        if (!isNaN(panelLength) && panelLength >= 0) {
            panelLengthInput.value = panelLength.toFixed(3);
        } else {
            console.warn(`Invalid panel length: ${panelLength}`);
        }
    }

    function getGageWidth() {
        return gageWidthInput.value ? parseFloat(gageWidthInput.value) : 0;
    }

    function setGageWidth(gageType) {
        // Check if the gage type is a valid value
        const validGageTypes = ["standard", "pedestrian"];
        if (validGageTypes.includes(gageType)) {
            // Set gage width based on gage type
            if (gageType === "standard") {
                gageWidthInput.value = 50.50 / 12; // Example value for standard gage
            } else if (gageType === "pedestrian") {
                gageWidthInput.value = 51.50 / 12; // Example value for pedestrian gage
            }
        } else {
            console.warn(`Invalid gage type: ${gageType}`);
        }
    }

    function getFieldWidth() {
        return fieldWidthInput.value ? parseFloat(fieldWidthInput.value) : 0;
    }

    function setFieldWidth(fieldWidth) {
        // Check if the field width is a valid number
        if (!isNaN(fieldWidth) && fieldWidth >= 0) {
            fieldWidthInput.value = fieldWidth.toFixed(3);
        } else {
            console.warn(`Invalid field width: ${fieldWidth}`);
        }
    }


    function getFieldRubberWidth() {
        return fieldRubberWidthInput.value ? parseFloat(fieldRubberWidthInput.value) : 0;
    }

    function setFieldRubberWidth(fieldRubberWidth) {
        // Check if the field rubber width is a valid number
        if (!isNaN(fieldRubberWidth) && fieldRubberWidth >= 0) {
            fieldRubberWidthInput.value = fieldRubberWidth.toFixed(3);
        } else {
            console.warn(`Invalid field rubber width: ${fieldRubberWidth}`);
        }
    }

    function getGageRubberWidth() {
        return gageRubberWidthInput.value ? parseFloat(gageRubberWidthInput.value) : 0;
    }

    function setGageRubberWidth(gageRubberWidth) {
        // Check if the gage rubber width is a valid number
        if (!isNaN(gageRubberWidth) && gageRubberWidth >= 0) {
            gageRubberWidthInput.value = gageRubberWidth.toFixed(3);
        } else {
            console.warn(`Invalid gage rubber width: ${gageRubberWidth}`);
        }
    }

    /**
     * Updates the visual indicator for auto-managed fields
     * @param {string} fieldName - Field name (e.g., 'panelType', 'panelLength', 'gageWidth', etc.)
     */
    function updateAutoIndicator(fieldName) {
        const isAuto = autoManagedFields[fieldName];
        let badge, resetBtn;

        // Map field names to their badge and reset button elements
        const fieldMap = {
            'panelType': { badge: panelTypeBadge, resetBtn: panelTypeReset },
            'panelLength': { badge: panelLengthBadge, resetBtn: panelLengthReset },
            'gageWidth': { badge: gageWidthBadge, resetBtn: gageWidthReset },
            'fieldWidth': { badge: fieldWidthBadge, resetBtn: fieldWidthReset },
            'railSize': { badge: railSizeBadge, resetBtn: railSizeReset },
            'fieldRubberWidth': { badge: fieldRubberWidthBadge, resetBtn: fieldRubberWidthReset },
            'railHeadWidth': { badge: railHeadWidthBadge, resetBtn: railHeadWidthReset },
            'gageRubberWidth': { badge: gageRubberWidthBadge, resetBtn: gageRubberWidthReset }
        };

        const field = fieldMap[fieldName];
        if (!field || !field.badge || !field.resetBtn) return;

        badge = field.badge;
        resetBtn = field.resetBtn;

        if (isAuto) {
            badge.innerHTML = '<small>Auto</small>';
            badge.classList.remove('manual-mode');
            resetBtn.classList.remove('visible');
        } else {
            badge.innerHTML = '<small>Manual</small>';
            badge.classList.add('manual-mode');
            resetBtn.classList.add('visible');
        }
    }

    /**
     * Switches a field to manual mode
     * @param {string} fieldName - Any auto-managed field name
     */
    function setFieldManualMode(fieldName) {
        if (autoManagedFields[fieldName]) {
            autoManagedFields[fieldName] = false;
            updateAutoIndicator(fieldName);

            // Set panel type to manual mode if any setting is manually changed
            if (fieldName !== 'panelType') {
                autoManagedFields.panelType = false;
                updateAutoIndicator('panelType');
            }
        }
    }

    /**
     * Resets a field back to auto-managed mode
     * @param {string} fieldName - Any auto-managed field name (or 'panelType' for master reset)
     */
    function resetFieldToAuto(fieldName) {
        // Special case: Panel Type reset button resets ALL fields
        if (fieldName === 'panelType') {
            resetAllFieldsToAuto();
            return;
        }

        autoManagedFields[fieldName] = true;
        updateAutoIndicator(fieldName);

        // Check if all fields are now auto - if so, reset Panel Type to auto
        checkAndUpdatePanelTypeAuto();

        // Reapply the panel default value
        const currentPanelType = getPanelType();
        if (panelDefaults[currentPanelType]) {
            const defaults = panelDefaults[currentPanelType];

            if (fieldName === 'gageType') {
                const gageType = defaults.gageType || "standard";
                setGageType(gageType);
                currentPanelDefaults.gageType = gageType;
            } else if (fieldName === 'panelLength' && defaults.panelLength !== undefined) {
                setPanelLength(defaults.panelLength);
                currentPanelDefaults.panelLength = defaults.panelLength;
            } else if (fieldName === 'gageWidth') {
                const gageType = defaults.gageType || "standard";
                setGageWidth(gageType);
                currentPanelDefaults.gageWidth = (gageType === "standard" ? 50.50 / 12 : 51.50 / 12);
            } else if (fieldName === 'fieldWidth' && defaults.fieldWidth !== undefined) {
                setFieldWidth(defaults.fieldWidth);
                currentPanelDefaults.fieldWidth = defaults.fieldWidth;
            } else if (fieldName === 'railSize' && defaults.railSize !== undefined) {
                setRailSize(defaults.railSize);
                currentPanelDefaults.railSize = defaults.railSize;
            } else if (fieldName === 'fieldRubberWidth' && defaults.fieldRubberWidth !== undefined) {
                setFieldRubberWidth(defaults.fieldRubberWidth);
                currentPanelDefaults.fieldRubberWidth = defaults.fieldRubberWidth;
            } else if (fieldName === 'railHeadWidth' && defaults.railSize !== undefined) {
                setRailHeadWidth(defaults.railSize);
                currentPanelDefaults.railHeadWidth = railHeadWidths[defaults.railSize];
            } else if (fieldName === 'gageRubberWidth' && defaults.gageRubberWidth !== undefined) {
                setGageRubberWidth(defaults.gageRubberWidth);
                currentPanelDefaults.gageRubberWidth = defaults.gageRubberWidth;
            }
        }

        // Recalculate if we have a center radius
        if (measuredValues.centerRadius) {
            calculateAndUpdateFromCenterRadius(measuredValues.centerRadius);
        }
    }

    /**
     * Resets ALL fields to auto-managed mode (master reset)
     */
    function resetAllFieldsToAuto() {
        // Reset all fields to auto mode
        for (let field in autoManagedFields) {
            autoManagedFields[field] = true;
        }

        // Reapply all panel defaults
        const currentPanelType = getPanelType();
        setPanelTypeDefaults(currentPanelType);

        // Update all indicators
        updateAutoIndicator('panelType');
        updateAutoIndicator('gageType');
        updateAutoIndicator('panelLength');
        updateAutoIndicator('gageWidth');
        updateAutoIndicator('fieldWidth');
        updateAutoIndicator('railSize');
        updateAutoIndicator('fieldRubberWidth');
        updateAutoIndicator('railHeadWidth');
        updateAutoIndicator('gageRubberWidth');

        // Recalculate if we have a center radius
        if (measuredValues.centerRadius) {
            calculateAndUpdateFromCenterRadius(measuredValues.centerRadius);
        }
    }

    /**
     * Checks if all non-panelType fields are in auto mode
     * If yes, sets Panel Type back to auto mode
     */
    function checkAndUpdatePanelTypeAuto() {
        const allFieldsAuto = Object.keys(autoManagedFields).every(key =>
            key === 'panelType' || autoManagedFields[key]
        );

        if (allFieldsAuto && !autoManagedFields.panelType) {
            autoManagedFields.panelType = true;
            updateAutoIndicator('panelType');
        }
    }

    /**
     * Checks if a field value has been manually changed from panel default
     * @param {string} fieldName - 'fieldRubberWidth' or 'gageRubberWidth'
     * @param {number} currentValue - Current input value
     * @returns {boolean} True if value differs from panel default
     */
    function isValueModifiedFromDefault(fieldName, currentValue) {
        const defaultValue = currentPanelDefaults[fieldName];

        // If no default stored yet, not modified
        if (defaultValue === null || defaultValue === undefined) {
            return false;
        }

        // Compare with small tolerance for floating point
        const tolerance = 0.0001;
        return Math.abs(currentValue - defaultValue) > tolerance;
    }


    function setPanelTypeDefaults(panelType) {
        if (panelDefaults[panelType]) {
            const defaults = panelDefaults[panelType];

            // Set gage type (always set, not auto-managed separately)
            setGageType(defaults.gageType || "standard");

            // Set panel length (only if in auto mode)
            if (autoManagedFields.panelLength) {
                setPanelLength(defaults.panelLength || 0);
                currentPanelDefaults.panelLength = defaults.panelLength || 0;
            } else {
                currentPanelDefaults.panelLength = defaults.panelLength || 0;
            }

            // Set gage width (only if in auto mode)
            if (autoManagedFields.gageWidth) {
                setGageWidth(defaults.gageType || "standard");
                const gageType = defaults.gageType || "standard";
                currentPanelDefaults.gageWidth = (gageType === "standard" ? 50.50 / 12 : 51.50 / 12);
            } else {
                const gageType = defaults.gageType || "standard";
                currentPanelDefaults.gageWidth = (gageType === "standard" ? 50.50 / 12 : 51.50 / 12);
            }

            // Set field width (only if in auto mode)
            if (autoManagedFields.fieldWidth) {
                setFieldWidth(defaults.fieldWidth || 0);
                currentPanelDefaults.fieldWidth = defaults.fieldWidth || 0;
            } else {
                currentPanelDefaults.fieldWidth = defaults.fieldWidth || 0;
            }

            // Set rail size (only if in auto mode)
            if (autoManagedFields.railSize) {
                setRailSize(defaults.railSize || "133");
                currentPanelDefaults.railSize = defaults.railSize || "133";
            } else {
                currentPanelDefaults.railSize = defaults.railSize || "133";
            }

            // Set field rubber width (only if in auto mode)
            if (autoManagedFields.fieldRubberWidth) {
                setFieldRubberWidth(defaults.fieldRubberWidth || 0);
                currentPanelDefaults.fieldRubberWidth = defaults.fieldRubberWidth || 0;
            } else {
                currentPanelDefaults.fieldRubberWidth = defaults.fieldRubberWidth || 0;
            }

            // Set rail head width (only if in auto mode)
            if (autoManagedFields.railHeadWidth) {
                setRailHeadWidth(defaults.railSize || "133");
                currentPanelDefaults.railHeadWidth = railHeadWidths[defaults.railSize || "133"];
            } else {
                currentPanelDefaults.railHeadWidth = railHeadWidths[defaults.railSize || "133"];
            }

            // Set gage rubber width (only if in auto mode)
            if (autoManagedFields.gageRubberWidth) {
                setGageRubberWidth(defaults.gageRubberWidth || 0);
                currentPanelDefaults.gageRubberWidth = defaults.gageRubberWidth || 0;
            } else {
                currentPanelDefaults.gageRubberWidth = defaults.gageRubberWidth || 0;
            }

            // Update visual indicators for all fields
            updateAutoIndicator('panelLength');
            updateAutoIndicator('gageWidth');
            updateAutoIndicator('fieldWidth');
            updateAutoIndicator('railSize');
            updateAutoIndicator('fieldRubberWidth');
            updateAutoIndicator('railHeadWidth');
            updateAutoIndicator('gageRubberWidth');

        } else {
            console.warn(`No defaults found for panel type: ${panelType}`);
        }
    }

    function initializeCompareColumnToggle() {
        // Load saved state from localStorage
        const savedState = localStorage.getItem('compare-column-visible');
        isCompareColumnVisible = savedState === 'true'; // Default false if not set

        // Set checkbox state
        compareColumnToggle.checked = isCompareColumnVisible;

        // Apply initial visibility
        updateCompareColumnVisibility(false); // false = no animation on load
    }

    function updateCompareColumnVisibility(animate = true) {
        if (isCompareColumnVisible) {
            compareColumn.classList.remove('d-none');
            calculationsRow.classList.remove('single-column');

            // Recalculate compare values if we have measured data
            if (measuredValues.centerRadius) {
                const roundedDegree = Math.round(radiusToDegree(measuredValues.centerRadius));
                const compareCenterRadius = degreeToRadius(roundedDegree);
                calculateAndUpdateFromCenterRadius(compareCenterRadius, compareValues, compareElements);
            }
        } else {
            compareColumn.classList.add('d-none');
            calculationsRow.classList.add('single-column');
        }

        // Save state to localStorage
        localStorage.setItem('compare-column-visible', isCompareColumnVisible);
    }

    function toggleCompareColumn() {
        isCompareColumnVisible = !isCompareColumnVisible;
        updateCompareColumnVisibility(true);
    }

    function setMeasuredDegree(centerRadius) {
        const degree = 12 * (centerRadius - Math.sqrt(centerRadius * centerRadius - 961));
        measuredDegree.innerText = degree.toFixed(3);
    }
    function setRoundedDownDegree(centerRadius) {
        const degree = Math.floor(12 * (centerRadius - Math.sqrt(centerRadius * centerRadius - 961)));
        roundedDownDegree.innerText = degree.toFixed(0);
    }
    function setRoundedUpDegree(centerRadius) {
        const degree = Math.ceil(12 * (centerRadius - Math.sqrt(centerRadius * centerRadius - 961)));
        roundedUpDegree.innerText = degree.toFixed(0);
    }

    // Radius Calculations
    function setAllMeasuredRadii(centerRadius) {
        const offset1 = getGageWidth() / 2;
        const offset2 = getGageWidth() / 2 + getGageRubberWidth() + getRailHeadWidth() + getFieldRubberWidth();
        const offset3 = getGageWidth() / 2 + getGageRubberWidth() + getRailHeadWidth() + getFieldRubberWidth() + getFieldWidth();

        // console.log(`Center Radius: ${centerRadius}, Offsets: ${offset1}, ${offset2}, ${offset3}`);

        const measuredR6 = centerRadius + offset3;
        const measuredR5 = centerRadius + offset2;
        const measuredR4 = centerRadius + offset1;
        const measuredR3 = centerRadius - offset1;
        const measuredR2 = centerRadius - offset2;
        const measuredR1 = centerRadius - offset3;

        measuredTable.r6.radius.innerText = measuredR6.toFixed(3);
        measuredTable.r5.radius.innerText = measuredR5.toFixed(3);
        measuredTable.r4.radius.innerText = measuredR4.toFixed(3);
        measuredTable.r3.radius.innerText = measuredR3.toFixed(3);
        measuredTable.r2.radius.innerText = measuredR2.toFixed(3);
        measuredTable.r1.radius.innerText = measuredR1.toFixed(3);
    };

    function setRoundedDownRadii(centerRadius) {
        const offset1 = getGageWidth() / 2;
        const offset2 = getGageWidth() / 2 + getGageRubberWidth() + getRailHeadWidth() + getFieldRubberWidth();
        const offset3 = getGageWidth() / 2 + getGageRubberWidth() + getRailHeadWidth() + getFieldRubberWidth() + getFieldWidth();

        // console.log(`Center Radius: ${centerRadius}, Offsets: ${offset1}, ${offset2}, ${offset3}`);

        const roundedDownR6 = centerRadius + offset3;
        const roundedDownR5 = centerRadius + offset2;
        const roundedDownR4 = centerRadius + offset1;
        const roundedDownR3 = centerRadius - offset1;
        const roundedDownR2 = centerRadius - offset2;
        const roundedDownR1 = centerRadius - offset3;

        roundedDownR6Input.value = roundedDownR6.toFixed(3);
        roundedDownR5Input.value = roundedDownR5.toFixed(3);
        roundedDownR4Input.value = roundedDownR4.toFixed(3);
        roundedDownR3Input.value = roundedDownR3.toFixed(3);
        roundedDownR2Input.value = roundedDownR2.toFixed(3);
        roundedDownR1Input.value = roundedDownR1.toFixed(3);
    }

    function setRoundedUpRadii(centerRadius) {
        const offset1 = getGageWidth() / 2;
        const offset2 = getGageWidth() / 2 + getGageRubberWidth() + getRailHeadWidth() + getFieldRubberWidth();
        const offset3 = getGageWidth() / 2 + getGageRubberWidth() + getRailHeadWidth() + getFieldRubberWidth() + getFieldWidth();

        // console.log(`Center Radius: ${centerRadius}, Offsets: ${offset1}, ${offset2}, ${offset3}`);

        const roundedUpR6 = centerRadius + offset3;
        const roundedUpR5 = centerRadius + offset2;
        const roundedUpR4 = centerRadius + offset1;
        const roundedUpR3 = centerRadius - offset1;
        const roundedUpR2 = centerRadius - offset2;
        const roundedUpR1 = centerRadius - offset3;

        roundedUpR6Input.value = roundedUpR6.toFixed(3);
        roundedUpR5Input.value = roundedUpR5.toFixed(3);
        roundedUpR4Input.value = roundedUpR4.toFixed(3);
        roundedUpR3Input.value = roundedUpR3.toFixed(3);
        roundedUpR2Input.value = roundedUpR2.toFixed(3);
        roundedUpR1Input.value = roundedUpR1.toFixed(3);
    }

    // Chord Length Calculation
    function setAllMeasuredChords(centerRadius) {
        const panelLength = getPanelLength();
        const measuredR6 = parseFloat(measuredR6Input.value) || 0;
        const measuredR5 = parseFloat(measuredR5Input.value) || 0;
        const measuredR4 = parseFloat(measuredR4Input.value) || 0;
        const measuredR3 = parseFloat(measuredR3Input.value) || 0;
        const measuredR2 = parseFloat(measuredR2Input.value) || 0;
        const measuredR1 = parseFloat(measuredR1Input.value) || 0;
        const theta = Math.asin(panelLength / (2 * centerRadius));

        const measuredChordR6 = 2 * measuredR6 * Math.sin(theta);
        const measuredChordR5 = 2 * measuredR5 * Math.sin(theta);
        const measuredChordR4 = 2 * measuredR4 * Math.sin(theta);
        const measuredChordR3 = 2 * measuredR3 * Math.sin(theta);
        const measuredChordR2 = 2 * measuredR2 * Math.sin(theta);
        const measuredChordR1 = 2 * measuredR1 * Math.sin(theta);

        measuredChord6Input.value = measuredChordR6.toFixed(3);
        measuredChord5Input.value = measuredChordR5.toFixed(3);
        measuredChord4Input.value = measuredChordR4.toFixed(3);
        measuredChord3Input.value = measuredChordR3.toFixed(3);
        measuredChord2Input.value = measuredChordR2.toFixed(3);
        measuredChord1Input.value = measuredChordR1.toFixed(3);

    }

    function setRoundedDownChords(centerRadius) {
        const panelLength = getPanelLength();
        const roundedDownR6 = parseFloat(roundedDownR6Input.value) || 0;
        const roundedDownR5 = parseFloat(roundedDownR5Input.value) || 0;
        const roundedDownR4 = parseFloat(roundedDownR4Input.value) || 0;
        const roundedDownR3 = parseFloat(roundedDownR3Input.value) || 0;
        const roundedDownR2 = parseFloat(roundedDownR2Input.value) || 0;
        const roundedDownR1 = parseFloat(roundedDownR1Input.value) || 0;
        const theta = Math.asin(panelLength / (2 * centerRadius));

        const roundedDownChordR6 = 2 * roundedDownR6 * Math.sin(theta);
        const roundedDownChordR5 = 2 * roundedDownR5 * Math.sin(theta);
        const roundedDownChordR4 = 2 * roundedDownR4 * Math.sin(theta);
        const roundedDownChordR3 = 2 * roundedDownR3 * Math.sin(theta);
        const roundedDownChordR2 = 2 * roundedDownR2 * Math.sin(theta);
        const roundedDownChordR1 = 2 * roundedDownR1 * Math.sin(theta);

        roundedDownChord6Input.value = roundedDownChordR6.toFixed(3);
        roundedDownChord5Input.value = roundedDownChordR5.toFixed(3);
        roundedDownChord4Input.value = roundedDownChordR4.toFixed(3);
        roundedDownChord3Input.value = roundedDownChordR3.toFixed(3);
        roundedDownChord2Input.value = roundedDownChordR2.toFixed(3);
        roundedDownChord1Input.value = roundedDownChordR1.toFixed(3);

        const measuredChord6 = parseFloat(measuredChord6Input.value) || 0;
        if (roundedDownChordR6 > measuredChord6 - ((1 / 8) / 12)) {
            roundedDownChord6Input.classList.add("is-valid");
            roundedDownChord6Input.classList.remove("is-invalid");
        }
        else {
            roundedDownChord6Input.classList.add("is-invalid");
            roundedDownChord6Input.classList.remove("is-valid");
        }

    }

    function setRoundedUpChords(centerRadius) {
        const panelLength = getPanelLength();
        const roundedUpR6 = parseFloat(roundedUpR6Input.value) || 0;
        const roundedUpR5 = parseFloat(roundedUpR5Input.value) || 0;
        const roundedUpR4 = parseFloat(roundedUpR4Input.value) || 0;
        const roundedUpR3 = parseFloat(roundedUpR3Input.value) || 0;
        const roundedUpR2 = parseFloat(roundedUpR2Input.value) || 0;
        const roundedUpR1 = parseFloat(roundedUpR1Input.value) || 0;
        const theta = Math.asin(panelLength / (2 * centerRadius));

        const roundedUpChordR6 = 2 * roundedUpR6 * Math.sin(theta);
        const roundedUpChordR5 = 2 * roundedUpR5 * Math.sin(theta);
        const roundedUpChordR4 = 2 * roundedUpR4 * Math.sin(theta);
        const roundedUpChordR3 = 2 * roundedUpR3 * Math.sin(theta);
        const roundedUpChordR2 = 2 * roundedUpR2 * Math.sin(theta);
        const roundedUpChordR1 = 2 * roundedUpR1 * Math.sin(theta);

        roundedUpChord6Input.value = roundedUpChordR6.toFixed(3);
        roundedUpChord5Input.value = roundedUpChordR5.toFixed(3);
        roundedUpChord4Input.value = roundedUpChordR4.toFixed(3);
        roundedUpChord3Input.value = roundedUpChordR3.toFixed(3);
        roundedUpChord2Input.value = roundedUpChordR2.toFixed(3);
        roundedUpChord1Input.value = roundedUpChordR1.toFixed(3);

    }



    function degreeToRadius(degree) {
        const CLradius = (degree / 12 / 2) + ((62 * 62) / (8 * degree / 12));
        return CLradius;
    }

    function radiusToDegree(radius) {
        const degree = 12 * (radius - Math.sqrt(radius * radius - 961));
        return degree;
    }

    function setMeasuredRise(centerRadius) {
        const panelLength = getPanelLength();
        const theta = Math.asin(panelLength / (2 * centerRadius));

        const versine = 1 - Math.cos(theta);
        const measuredRiseFt = centerRadius * versine;
        const measuredRiseIn = measuredRiseFt * 12; // Convert feet to inches
        measuredRiseInput.value = measuredRiseIn.toFixed(3);
    }

    // Central calculation and update function for any value set (measured or compare)
    function calculateAndUpdateFromCenterRadius(centerRadius, valuesObj = measuredValues, elementsObj = measuredElements) {
        if (!centerRadius || isNaN(centerRadius)) return;

        // Calculate all values
        const panelLength = getPanelLength();
        const degree = radiusToDegree(centerRadius);
        const theta = Math.asin(panelLength / (2 * centerRadius));

        // Calculate rise
        const versine = 1 - Math.cos(theta);
        const measuredRiseFt = centerRadius * versine;
        const measuredRiseIn = measuredRiseFt * 12;

        // Calculate offsets for radii
        const offset1 = getGageWidth() / 2;
        const offset2 = getGageWidth() / 2 + getGageRubberWidth() + getRailHeadWidth() + getFieldRubberWidth();
        const offset3 = getGageWidth() / 2 + getGageRubberWidth() + getRailHeadWidth() + getFieldRubberWidth() + getFieldWidth();

        // Update values object
        valuesObj.degree = degree;
        valuesObj.rise = measuredRiseIn;
        valuesObj.centerRadius = centerRadius;
        valuesObj.highRadius = centerRadius + (getRailHeadWidth() / 2 + getGageRubberWidth() + getGageWidth() / 2);
        valuesObj.lowRadius = centerRadius - (getRailHeadWidth() / 2 + getGageRubberWidth() + getGageWidth() / 2);

        // Calculate radii for all layers
        const radii = {
            r6: centerRadius + offset3,
            r5: centerRadius + offset2,
            r4: centerRadius + offset1,
            r3: centerRadius - offset1,
            r2: centerRadius - offset2,
            r1: centerRadius - offset3
        };

        Object.keys(radii).forEach(key => {
            valuesObj[key].radius = radii[key];
            valuesObj[key].chord = 2 * radii[key] * Math.sin(theta);
            valuesObj[key].arcLength = 2 * radii[key] * theta;
            valuesObj[key].cutLength = valuesObj[key].arcLength - (1 / 12);
        });

        // Update all DOM elements
        updateElementsFromValues(valuesObj, elementsObj);
    }

    // Function to update DOM elements from any values/elements object pair
    function updateElementsFromValues(valuesObj, elementsObj) {
        if (elementsObj.degree) {
            elementsObj.degree.value = parseFloat(valuesObj.degree.toFixed(3));
        }
        if (elementsObj.rise) {
            elementsObj.rise.value = inchesToFractional(valuesObj.rise, 32);
        }

        ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'].forEach(layer => {
            if (elementsObj[layer]) {
                if (elementsObj[layer].radius) {
                    elementsObj[layer].radius.textContent = feetToArchitectural(valuesObj[layer].radius);
                }
                if (elementsObj[layer].chord) {
                    elementsObj[layer].chord.textContent = feetToArchitectural(valuesObj[layer].chord);
                }
                if (elementsObj[layer].arcLength) {
                    elementsObj[layer].arcLength.textContent = feetToArchitectural(valuesObj[layer].arcLength);
                }
                if (elementsObj[layer].cutLength) {
                    elementsObj[layer].cutLength.textContent = feetToArchitectural(valuesObj[layer].cutLength);
                }
            }
        });

        validateSpec();
    }

    function validateSpec() {
        // Only validate if compare column is visible
        if (!isCompareColumnVisible) {
            return;
        }

        const tolerance = 1/8/12; // 1/8" in feet

        ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'].forEach(layer => {
            const diff = Math.abs(measuredValues[layer].chord - compareValues[layer].chord);
            const specCell = compareElements[layer].spec;

            // Remove all existing spec classes
            specCell.classList.remove('spec-pass', 'spec-fail');

            // Remove old row-based classes if they exist
            const row = document.getElementById(`compare-${layer}`);
            if (row) {
                row.classList.remove('table-success', 'table-danger');
            }

            // Apply pass/fail class based on tolerance
            if (diff < tolerance) {
                specCell.classList.add('spec-pass');
                specCell.textContent = "✓";
            } else {
                specCell.classList.add('spec-fail');
                specCell.textContent = "✗";
            }
        });
    }


    /**
     * Converts a decimal feet value to an architectural string format (e.g., 5'-7 1/2").
     * @param {number} feet - The length in decimal feet.
     * @returns {string} The formatted architectural string.
     */
    function feetToArchitectural(feet) {
        // var feetString = feet.toString().split('.')[0];
        var feetString = Math.floor(feet);
        // var inchesString = "0." + feet.toString().split('.')[1];
        var inches = (feet - feetString) * 12;
        var inchesString = Math.floor(inches);

        var fraction = inches - inchesString;
        var denominator = 16;
        var numerator = Math.round(fraction * denominator); // Round to nearest 1/16 inch

        while (numerator % 2 === 0 && numerator > 0) {
            numerator /= 2;
            denominator /= 2;
        }

        // Uncomment for debugging:
        // console.log(`Feet: ${feetString}, Inches: ${inchesString}, Fraction: ${numerator}/${denominator} - ${fraction}`);
        if (numerator === 0) {
            return `${feetString}'-${inchesString}"`;
        } else {
            return `${feetString}'-${inchesString} ${numerator}/${denominator}"`;
        }
    }

    function inchesToFractional(inches, denominator) {
        if (isNaN(inches) || inches < 0) {
            return "0";
        }
        var wholeInches = Math.floor(inches);
        var fractionalPart = inches - wholeInches;
        var numerator = Math.round(fractionalPart * denominator);
        
        // Reduce fraction
        while (numerator % 2 === 0 && numerator > 0) {
            numerator /= 2;
            denominator /= 2;
        }

        if (numerator === 0) {
            return `${wholeInches}"`;
        } else if (wholeInches === 0) {
            return `${numerator}/${denominator}"`;
        } else {
            return `${wholeInches} ${numerator}/${denominator}"`;
        }
    }


    // Call the function when the page loads
    // setDefaultValues();
    setPanelTypeDefaults(getPanelType()); // Set defaults for the initial panel type

    // Initialize auto indicators
    updateAutoIndicator('panelType');
    updateAutoIndicator('panelLength');
    updateAutoIndicator('gageWidth');
    updateAutoIndicator('fieldWidth');
    updateAutoIndicator('railSize');
    updateAutoIndicator('fieldRubberWidth');
    updateAutoIndicator('railHeadWidth');
    updateAutoIndicator('gageRubberWidth');

    var previousPanelType;
    panelTypeSelect.addEventListener("focus", function () {
        previousPanelType = panelTypeSelect.value;
    });
    panelTypeSelect.addEventListener("change", function () {
        const newPanelType = panelTypeSelect.value;
        setPanelType(newPanelType);
        previousPanelType = newPanelType;

        // Apply new panel defaults
        // Auto-managed fields will update, manual fields will preserve values
        setPanelTypeDefaults(newPanelType);

        // Check if any fields are in manual mode
        const anyFieldManual = Object.keys(autoManagedFields).some(key =>
            key !== 'panelType' && !autoManagedFields[key]
        );

        if (anyFieldManual) {
            autoManagedFields.panelType = false;
            updateAutoIndicator('panelType');
        }
    });

    panelLengthInput.addEventListener("change", function () {
        const currentValue = parseFloat(this.value);

        // Check if value differs from panel default
        if (autoManagedFields.panelLength &&
            isValueModifiedFromDefault('panelLength', currentValue)) {
            setFieldManualMode('panelLength');
        }

        // Recalculate if we have a center radius
        if (measuredValues.centerRadius) {
            calculateAndUpdateFromCenterRadius(measuredValues.centerRadius);
        }
    });

    radio_objects.forEach(function (radio) {
        radio.addEventListener("change", function () {
            // alert(this.value);
            setGageType(this.value);

            // Check if gage type differs from panel default
            if (autoManagedFields.gageType &&
                currentPanelDefaults.gageType &&
                this.value !== currentPanelDefaults.gageType) {
                setFieldManualMode('gageType');
                // Gage type change affects gage width, so mark it as manual too
                setFieldManualMode('gageWidth');
            }

            // Recalculate if we have a center radius
            if (measuredValues.centerRadius) {
                calculateAndUpdateFromCenterRadius(measuredValues.centerRadius);
            }
        });
    });

    fieldWidthInput.addEventListener("change", function () {
        const currentValue = parseFloat(this.value);

        // Check if value differs from panel default
        if (autoManagedFields.fieldWidth &&
            isValueModifiedFromDefault('fieldWidth', currentValue)) {
            setFieldManualMode('fieldWidth');
        }

        // Recalculate if we have a center radius
        if (measuredValues.centerRadius) {
            calculateAndUpdateFromCenterRadius(measuredValues.centerRadius);
        }
    });

    // Add listeners for other parameters that affect calculations
    gageWidthInput.addEventListener("change", function () {
        const currentValue = parseFloat(this.value);

        // Check if value differs from panel default
        if (autoManagedFields.gageWidth &&
            isValueModifiedFromDefault('gageWidth', currentValue)) {
            setFieldManualMode('gageWidth');
        }

        if (measuredValues.centerRadius) {
            calculateAndUpdateFromCenterRadius(measuredValues.centerRadius);
        }
    });

    fieldRubberWidthInput.addEventListener("change", function () {
        const currentValue = parseFloat(this.value);

        // Check if value differs from panel default
        if (autoManagedFields.fieldRubberWidth &&
            isValueModifiedFromDefault('fieldRubberWidth', currentValue)) {
            setFieldManualMode('fieldRubberWidth');
        }

        // Recalculate if we have a center radius
        if (measuredValues.centerRadius) {
            calculateAndUpdateFromCenterRadius(measuredValues.centerRadius);
        }
    });

    gageRubberWidthInput.addEventListener("change", function () {
        const currentValue = parseFloat(this.value);

        // Check if value differs from panel default
        if (autoManagedFields.gageRubberWidth &&
            isValueModifiedFromDefault('gageRubberWidth', currentValue)) {
            setFieldManualMode('gageRubberWidth');
        }

        // Recalculate if we have a center radius
        if (measuredValues.centerRadius) {
            calculateAndUpdateFromCenterRadius(measuredValues.centerRadius);
        }
    });

    // Reset button listeners for auto-managed fields
    panelTypeReset.addEventListener("click", function () {
        resetFieldToAuto('panelType'); // Master reset - resets all fields
    });

    panelLengthReset.addEventListener("click", function () {
        resetFieldToAuto('panelLength');
    });

    gageWidthReset.addEventListener("click", function () {
        resetFieldToAuto('gageWidth');
    });

    fieldWidthReset.addEventListener("click", function () {
        resetFieldToAuto('fieldWidth');
    });

    railSizeReset.addEventListener("click", function () {
        resetFieldToAuto('railSize');
    });

    fieldRubberWidthReset.addEventListener("click", function () {
        resetFieldToAuto('fieldRubberWidth');
    });

    railHeadWidthReset.addEventListener("click", function () {
        resetFieldToAuto('railHeadWidth');
    });

    gageRubberWidthReset.addEventListener("click", function () {
        resetFieldToAuto('gageRubberWidth');
    });

    measuredElements.centerRadius.addEventListener("change", function () {
        const centerRadius = parseFloat(measuredElements.centerRadius.value);
        if (!isNaN(centerRadius)) {
            calculateAndUpdateFromCenterRadius(centerRadius);

            // Only calculate compare if column is visible
            if (isCompareColumnVisible) {
                roundedDegree = Math.round(radiusToDegree(centerRadius));
                compareCenterRadius = degreeToRadius(roundedDegree);
                calculateAndUpdateFromCenterRadius(compareCenterRadius, compareValues, compareElements);
            }

            // Clear the input fields for High and Low Radii
            measuredElements.highRadius.value = "";
            measuredElements.lowRadius.value = "";
        }
    });

    measuredElements.highRadius.addEventListener("change", function () {
        const highRadius = parseFloat(measuredElements.highRadius.value);
        if (!isNaN(highRadius)) {
            const centerRadius = highRadius - (getRailHeadWidth() / 2 + getGageRubberWidth() + getGageWidth() / 2);
            calculateAndUpdateFromCenterRadius(centerRadius);

            // Only calculate compare if column is visible
            if (isCompareColumnVisible) {
                roundedDegree = Math.round(radiusToDegree(centerRadius));
                compareCenterRadius = degreeToRadius(roundedDegree);
                calculateAndUpdateFromCenterRadius(compareCenterRadius, compareValues, compareElements);
            }

            // Clear the input fields for Center and Low Radii
            measuredElements.centerRadius.value = "";
            measuredElements.lowRadius.value = "";
        }
    });

    measuredElements.lowRadius.addEventListener("change", function () {
        const lowRadius = parseFloat(measuredElements.lowRadius.value);
        if (!isNaN(lowRadius)) {
            const centerRadius = lowRadius + (getRailHeadWidth() / 2 + getGageRubberWidth() + getGageWidth() / 2);
            calculateAndUpdateFromCenterRadius(centerRadius);

            // Only calculate compare if column is visible
            if (isCompareColumnVisible) {
                roundedDegree = Math.round(radiusToDegree(centerRadius));
                compareCenterRadius = degreeToRadius(roundedDegree);
                calculateAndUpdateFromCenterRadius(compareCenterRadius, compareValues, compareElements);
            }

            // Update the center radius display and clear other inputs
            measuredElements.centerRadius.value = ""
            measuredElements.highRadius.value = "";
        }
    });

    measuredElements.degree.addEventListener("change", function () {
        const degree = parseFloat(measuredElements.degree.value);
        if (!isNaN(degree)) {
            const centerRadius = degreeToRadius(degree);
            calculateAndUpdateFromCenterRadius(centerRadius);
        }

        // Clear the radius inputs
        measuredElements.highRadius.value = "";
        measuredElements.centerRadius.value = "";
        measuredElements.lowRadius.value = "";
    });

    compareElements.degree.addEventListener("change", function () {
        const degree = parseFloat(compareElements.degree.value);
        if (!isNaN(degree)) {
            const centerRadius = degreeToRadius(degree);
            calculateAndUpdateFromCenterRadius(centerRadius, compareValues, compareElements);
        }

        // Clear the radius inputs
        compareElements.highRadius.value = "";
        compareElements.centerRadius.value = "";
        compareElements.lowRadius.value = "";
    });

    compareElements.centerRadius.addEventListener("change", function () {
        const centerRadius = parseFloat(compareElements.centerRadius.value);
        if (!isNaN(centerRadius)) {
            calculateAndUpdateFromCenterRadius(centerRadius, compareValues, compareElements);

            // Clear the input fields for High and Low Radii
            compareElements.highRadius.value = "";
            compareElements.lowRadius.value = "";
        }
    });

    compareElements.highRadius.addEventListener("change", function () {
        const highRadius = parseFloat(compareElements.highRadius.value);
        if (!isNaN(highRadius)) {
            const centerRadius = highRadius - (getRailHeadWidth() / 2 + getGageRubberWidth() + getGageWidth() / 2);
            calculateAndUpdateFromCenterRadius(centerRadius, compareValues, compareElements);

            // Clear the input fields for Center and Low Radii
            compareElements.centerRadius.value = "";
            compareElements.lowRadius.value = "";
        }
    });

    compareElements.lowRadius.addEventListener("change", function () {
        const lowRadius = parseFloat(compareElements.lowRadius.value);
        if (!isNaN(lowRadius)) {
            const centerRadius = lowRadius + (getRailHeadWidth() / 2 + getGageRubberWidth() + getGageWidth() / 2);
            calculateAndUpdateFromCenterRadius(centerRadius, compareValues, compareElements);

            // Clear the input fields for Center and High Radii
            compareElements.centerRadius.value = "";
            compareElements.highRadius.value = "";
        }
    });

    var previousRailSize;
    railSizeSelect.addEventListener("focus", function () {
        previousRailSize = railSizeSelect.value;
    });
    railSizeSelect.addEventListener("change", function () {
        const newRailSize = railSizeSelect.value;

        // Check if value differs from panel default
        if (autoManagedFields.railSize &&
            currentPanelDefaults.railSize &&
            newRailSize !== currentPanelDefaults.railSize) {
            setFieldManualMode('railSize');
        }

        setRailSize(newRailSize);
        previousRailSize = newRailSize;

        // Recalculate if we have a center radius
        if (measuredValues.centerRadius) {
            calculateAndUpdateFromCenterRadius(measuredValues.centerRadius);
        }
    });

    railHeadWidthInput.addEventListener("change", function () {
        const currentValue = parseFloat(this.value);

        // Check if value differs from panel default
        if (autoManagedFields.railHeadWidth &&
            isValueModifiedFromDefault('railHeadWidth', currentValue)) {
            setFieldManualMode('railHeadWidth');
        }

        // Recalculate if we have a center radius
        if (measuredValues.centerRadius) {
            calculateAndUpdateFromCenterRadius(measuredValues.centerRadius);
        }
    });

    // Compare column toggle
    compareColumnToggle.addEventListener('change', function() {
        toggleCompareColumn();
    });

    // Initialize toggle state on page load
    initializeCompareColumnToggle();

    // Advanced Settings Toggle
    const advancedSettingsToggle = document.getElementById("advancedSettingsToggle");
    const advancedSettings = document.getElementById("advancedSettings");
    const advancedSettingsToggleText = document.getElementById("advancedSettingsToggleText");
    const advancedSettingsToggleIcon = document.getElementById("advancedSettingsToggleIcon");

    advancedSettingsToggle.addEventListener('click', function() {
        const isExpanded = advancedSettings.classList.contains('show');

        if (isExpanded) {
            advancedSettings.classList.remove('show');
            advancedSettingsToggleText.textContent = "Show Advanced Settings";
            advancedSettingsToggleIcon.textContent = "▼";
        } else {
            advancedSettings.classList.add('show');
            advancedSettingsToggleText.textContent = "Hide Advanced Settings";
            advancedSettingsToggleIcon.textContent = "▲";
        }
    });
});

// Color Scheme Toggle
const selectedColorScheme = localStorage.getItem('color-scheme') || 'light dark';

const applyScheme = (scheme) => {
    localStorage.setItem('color-scheme', scheme);
    document.documentElement.style.setProperty('color-scheme', scheme);
    document.querySelector(`[name="color-scheme"][value="${scheme}"]`).checked = true;
    // Tables are now fully styled via CSS light-dark(), no class changes needed
}

applyScheme(selectedColorScheme);

document.querySelectorAll('[name="color-scheme"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        applyScheme(e.target.value);
    });
});