document.addEventListener("DOMContentLoaded", function () {
    // https://stackoverflow.com/a/79490464
    let radio_objects = document.querySelectorAll("input[type='radio'][name=gageType]");
    for (let i = 0; i < radio_objects.length; i++)
    {
        radio_objects[i].addEventListener('click', function ()
        {
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
    const highRadiusInput = document.getElementById("highRadius");
    const centerRadiusInput = document.getElementById("centerRadius");
    const lowRadiusInput = document.getElementById("lowRadius");
    const measuredDegree = document.getElementById("measuredDegree");
    const roundedDownDegree = document.getElementById("roundedDownDegree");
    const roundedUpDegree = document.getElementById("roundedUpDegree");
    const measuredR6Input = document.getElementById("r6Measured");
    const measuredR5Input = document.getElementById("r5Measured");
    const measuredR4Input = document.getElementById("r4Measured");
    const measuredR3Input = document.getElementById("r3Measured");
    const measuredR2Input = document.getElementById("r2Measured");
    const measuredR1Input = document.getElementById("r1Measured");
    const measuredChord6Input = document.getElementById("chord6Measured");
    const measuredChord5Input = document.getElementById("chord5Measured");
    const measuredChord4Input = document.getElementById("chord4Measured");
    const measuredChord3Input = document.getElementById("chord3Measured");
    const measuredChord2Input = document.getElementById("chord2Measured");
    const measuredChord1Input = document.getElementById("chord1Measured");
    const roundedDownR6Input = document.getElementById("r6Down");
    const roundedDownR5Input = document.getElementById("r5Down");
    const roundedDownR4Input = document.getElementById("r4Down");
    const roundedDownR3Input = document.getElementById("r3Down");
    const roundedDownR2Input = document.getElementById("r2Down");
    const roundedDownR1Input = document.getElementById("r1Down");
    const roundedUpR6Input = document.getElementById("r6Up");
    const roundedUpR5Input = document.getElementById("r5Up");
    const roundedUpR4Input = document.getElementById("r4Up");
    const roundedUpR3Input = document.getElementById("r3Up");
    const roundedUpR2Input = document.getElementById("r2Up");
    const roundedUpR1Input = document.getElementById("r1Up");
    const roundedDownChord6Input = document.getElementById("chord6Down");
    const roundedDownChord5Input = document.getElementById("chord5Down");
    const roundedDownChord4Input = document.getElementById("chord4Down");
    const roundedDownChord3Input = document.getElementById("chord3Down");
    const roundedDownChord2Input = document.getElementById("chord2Down");
    const roundedDownChord1Input = document.getElementById("chord1Down");
    const roundedUpChord6Input = document.getElementById("chord6Up");
    const roundedUpChord5Input = document.getElementById("chord5Up");
    const roundedUpChord4Input = document.getElementById("chord4Up");
    const roundedUpChord3Input = document.getElementById("chord3Up");
    const roundedUpChord2Input = document.getElementById("chord2Up");
    const roundedUpChord1Input = document.getElementById("chord1Up");
    const measuredRiseInput = document.getElementById("measuredRise");


    var railSizeModified = false;
    var panelTypeModified = false;

    var theta = 0; // Initialize theta variable


    // Rail Head Widths
    const railHeadWidths = {
        "90": (2 + 9/16)/12,
        "110": (2 + 5/8)/12,
        "115": (2 + 11/16)/12,
        "119": (2 + 5/8)/12,
        "132": (2 + 15/16)/12,
        "133": (2 + 7/8)/12,
        "136": (2 + 7/8)/12,
        "140": (2 + 15/16)/12,
        "141": (3)/12
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

    function setRailSizeModified(modified, railSize) {
        // If railSize is not provided, use the currently selected rail size
        const targetRailSize = railSize || railSizeSelect.value;
        
        if (modified) {
            // Update the specified option in the select element to say (modified)
            const selectedOption = railSizeSelect.querySelector(`option[value="${targetRailSize}"]`);
            if (selectedOption) {
                selectedOption.textContent = `#${targetRailSize} (modified)`;
            }
        }
        else {
            // Reset the specified option in the select element to its original text
            const selectedOption = railSizeSelect.querySelector(`option[value="${targetRailSize}"]`);
            if (selectedOption) {
                selectedOption.textContent = `#${targetRailSize}`;
            }
        }
        
        if (targetRailSize === railSizeSelect.value) {
            railSizeModified = modified;
        }
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
            "gageWidth": 50.50/12,
            "fieldWidth": 27/12,
            "railSize": "133",
            "fieldRubberWidth": 2.5/12,
            "railHeadWidth": 3/12,
            "gageRubberWidth": 3/12
        },
        "1310": {
            "gageType": "pedestrian",
            "panelLength": 10,
            "gageWidth": 51.50/12,
            "fieldWidth": 18/12,
            "railSize": "115",
            "fieldRubberWidth": 2.5/12,
            "railHeadWidth": (2 + 11/16)/12,
            "gageRubberWidth": 2.5/12
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
            setPanelTypeModified(false, panelType);
        } else {
            console.warn(`Panel type ${panelType} does not exist in the options.`);
        }
    }

    function setPanelTypeModified(modified, panelType) {
        // If panelType is not provided, use the currently selected panel type
        const targetPanelType = panelType || panelTypeSelect.value;
        
        if (modified) {
            // Update the specified option in the select element to say (modified)
            const selectedOption = panelTypeSelect.querySelector(`option[value="${targetPanelType}"]`);
            if (selectedOption) {
                selectedOption.textContent = `${targetPanelType} (modified)`;
            }
        } else {
            // Reset the specified option in the select element to its original text
            const selectedOption = panelTypeSelect.querySelector(`option[value="${targetPanelType}"]`);
            if (selectedOption) {
                selectedOption.textContent = targetPanelType;
            }
        }
        
        if (targetPanelType === panelTypeSelect.value) {
            panelTypeModified = modified;
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
                gageWidthInput.value = 50.50/12; // Example value for standard gage
            } else if (gageType === "pedestrian") {
                gageWidthInput.value = 51.50/12; // Example value for pedestrian gage
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


    function setPanelTypeDefaults(panelType) {
        if (panelDefaults[panelType]) {
            const defaults = panelDefaults[panelType];

            // Set gage type
            setGageType(defaults.gageType || "standard");

            // Set panel length
            setPanelLength(defaults.panelLength || 0);

            // Set gage width
            // setGageWidth(defaults.gageType || 0);

            // Set field width
            setFieldWidth(defaults.fieldWidth || 0);

            // Set rail size
            setRailSize(defaults.railSize || "133");

            // Set field rubber width
            setFieldRubberWidth(defaults.fieldRubberWidth || 0);

            // Set rail head width
            setRailHeadWidth(defaults.railSize || "133");

            // Set gage rubber width
            setGageRubberWidth(defaults.gageRubberWidth || 0);


        } else {
            console.warn(`No defaults found for panel type: ${panelType}`);
        }
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

        measuredR6Input.value = measuredR6.toFixed(3);
        measuredR5Input.value = measuredR5.toFixed(3);
        measuredR4Input.value = measuredR4.toFixed(3);
        measuredR3Input.value = measuredR3.toFixed(3);
        measuredR2Input.value = measuredR2.toFixed(3);
        measuredR1Input.value = measuredR1.toFixed(3);
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
        if (roundedDownChordR6 > measuredChord6-((1/8)/12)) {
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

    // Call the function when the page loads
    // setDefaultValues();
    setPanelTypeDefaults(getPanelType()); // Set defaults for the initial panel type

    var previousPanelType;
    panelTypeSelect.addEventListener("focus", function () {
        previousPanelType = panelTypeSelect.value;
    });
    panelTypeSelect.addEventListener("change", function () {
        const newPanelType = panelTypeSelect.value;
        setPanelType(newPanelType);
        setPanelTypeModified(false, previousPanelType);
        previousPanelType = newPanelType;
        setPanelTypeDefaults(newPanelType);
    });

    panelLengthInput.addEventListener("change", function () {
        setPanelTypeModified(true);
    });

    radio_objects.forEach(function(radio) {
        radio.addEventListener("change", function() {
            // alert(this.value);
            setGageType(this.value);
            setPanelTypeModified(true);
        });
    });

    fieldWidthInput.addEventListener("change", function () {
        setPanelTypeModified(true);
    });

    centerRadiusInput.addEventListener("change", function () {
        const centerRadius = parseFloat(centerRadiusInput.value);
        const degree = radiusToDegree(centerRadius);
        setMeasuredDegree(centerRadius);
        setRoundedDownDegree(centerRadius);
        setRoundedUpDegree(centerRadius);
        // console.log(`Center Radius: ${centerRadius}, Degree: ${degree}`);
        const downRadius = degreeToRadius(Math.floor(degree));
        const upRadius = degreeToRadius(Math.ceil(degree));
        setAllMeasuredRadii(centerRadius);
        setAllMeasuredChords(centerRadius);
        setRoundedDownRadii(downRadius);
        setRoundedDownChords(downRadius);
        setRoundedUpRadii(upRadius);
        setRoundedUpChords(upRadius);

        setMeasuredRise(centerRadius);

        // Clear the input fields for High and Low Radii
        highRadiusInput.value = "";
        lowRadiusInput.value = "";
    });

    highRadiusInput.addEventListener("change", function () {
        const highRadius = parseFloat(highRadiusInput.value);
        
        const centerRadius = highRadius - (getRailHeadWidth()/2 + getGageRubberWidth() + getGageWidth()/2);
        setMeasuredDegree(centerRadius);
        setRoundedDownDegree(centerRadius);
        setRoundedUpDegree(centerRadius);
        
        setAllMeasuredRadii(centerRadius);
        setAllMeasuredChords(centerRadius);
        
        centerRadiusInput.value = "";
        lowRadiusInput.value = "";

    });

    lowRadiusInput.addEventListener("change", function () {
        const lowRadius = parseFloat(lowRadiusInput.value);
        
        const centerRadius = lowRadius + (getRailHeadWidth()/2 + getGageRubberWidth() + getGageWidth()/2);
        setMeasuredDegree(centerRadius);
        setRoundedDownDegree(centerRadius);
        setRoundedUpDegree(centerRadius);
        
        setAllMeasuredRadii(centerRadius);
        setAllMeasuredChords(centerRadius);
        
        centerRadiusInput.value = "";
        highRadiusInput.value = "";

    });

    var previousRailSize;
    railSizeSelect.addEventListener("focus", function () {
        previousRailSize = railSizeSelect.value;
    });
    railSizeSelect.addEventListener("change", function () {
        const newRailSize = railSizeSelect.value;
        setRailSize(newRailSize);
        setRailSizeModified(false, previousRailSize);
        previousRailSize = newRailSize;
    });

    railHeadWidthInput.addEventListener("change", function () {
        setRailSizeModified(true);
    });
});
