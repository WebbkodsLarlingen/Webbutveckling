// Denna fil ska innehålla er lösning till projektuppgiften.
/* Lösning till Uppgift Projektuppgift Introduktion till JavaScript Av WebbkodsLärlingen, 2022 */
'use strict';
/* Här under börjar du skriva din JavaScript-kod */

// FÖRST MASSOR AV GLOBALA VARIABLER = Dessa kan alla funktioner nyttja
// Kortar ned ett par variabler som används flitigt i koden
const clog = console.log;
const infoDivConst = document.getElementById('info');
let i; // För iterationer

// Några standardlänkar
const channelsURL = // Länk till JSON för alla kanaler
	'http://api.sr.se/api/v2/channels?format=json&pagination=false';
const srLogoURL =
	'https://sverigesradio.se/api/documentation/v2/img/Sverigesradio_srgb.gif';
const srLogoDarkURL =
	'https://static-cdn.sr.se/images/4282/d2067298-a21f-45da-b6bb-695f951dfd0a.jpg';

// Initiera globala variabler som alla funktioner kommer åt gällande localStorage()
let localStorageTextSizeP;
let localStorageTextSizeH5;
let localStorageDarkLightMode;
let localStorageTableMode;
let localStorageCurrentChannel;
let localStorageNumberOfChannels;

// Några Globala elementvariabler
let btnDecreaseEl = document.createElement('button'); // 4 Knappelement
let btnIncreaseEl = document.createElement('button');
let darkModeEl = document.createElement('button');
let tableModeEl = document.createElement('button');
let selectContainClass = document.getElementsByClassName('container'); // Används för Mörk-/ljusläge-funktionerna
let welcomeImgEl = document.createElement('img'); // SR-Logga bildelement
let correctSRImg; // Variabel så rätt SR-logga väljs efter mörk-/ljusläge

// Kör init()-funktionen när allt annat laddats fram först
window.onload = init;
function init() {
	loadStorageInit();
	loadChannels(localStorageNumberOfChannels); // Hämta antalet nuvarande kanaler, standard 10
	createButtons();
	// Visa välkomstmeddelande när ingen tidigare vald/localStorage-lagrad kanal finns
	// Annars hämtade nuvarande/senast visad kanal
	if (localStorage.getItem('CurrentChannel') == null) {
		welcomeMessage();
	} else {
		localStorageCurrentChannel == localStorage.getItem('CurrentChannel');
		fetchChannelData(localStorageCurrentChannel);
	}

	// Två händelsehanterare: Första är att ändra antalet radiokanaler "Max antal:"
	// Andra är att ladda om & nollställa sidan när man klickar på ("DT084G - Projekt")
	document
		.getElementById('numrows')
		.addEventListener('change', changeNumrows, false);
	document.getElementById('logo').addEventListener('click', loadFront, false);
}

// Rensa loadStorage, initiera om så standardutseendet/funktionerna kan läsas in på nytt
function loadFront() {
	localStorage.clear();
	loadStorageInit();
	LightMode();
	welcomeMessage();
	loadChannels(localStorageNumberOfChannels);
}

// localStorage() initiering, else-satserna betyder första gången sidan laddas utan localStorage-värden
function loadStorageInit() {
	// Hämta nuvarande textstorlek för p-element ELLER tilldela standardstorlek (15px)
	if (localStorage.getItem('TextSizeP')) {
		localStorageTextSizeP = parseInt(localStorage.getItem('TextSizeP'));
		// Inaktivera knappar om lägsta respektive högsta gränsen nåtts för textstorlek
		if (localStorageTextSizeP == 9) {
			btnDecreaseEl.disabled = true;
		}
		if (localStorageTextSizeP == 20) {
			btnIncreaseEl.disabled = true;
		}
	} else {
		// Tilldela standardstorlek och aktivera knappar eftersom de får användas igen
		localStorageTextSizeP = 15;
		localStorage.setItem('TextSizeP', localStorageTextSizeP);
		btnDecreaseEl.disabled = false;
		btnIncreaseEl.disabled = false;
	}
	// Hämta nuvarande textstorlek för H5 ELLER tilldela standardstorlek (14px)
	if (localStorage.getItem('TextSizeH5')) {
		localStorageTextSizeH5 = parseInt(localStorage.getItem('TextSizeH5'));
		if (localStorageTextSizeH5 == 8) {
			btnDecreaseEl.disabled = true;
		}
		if (localStorageTextSizeH5 == 19) {
			btnIncreaseEl.disabled = true;
		}
		clog('TextSize h5 (egen) = ' + localStorageTextSizeH5);
	} else {
		localStorageTextSizeH5 = 14;
		localStorage.setItem('TextSizeH5', localStorageTextSizeH5);
		btnDecreaseEl.disabled = false;
		btnIncreaseEl.disabled = false;
		clog('Sätter TextSize h5 Standard = ' + localStorageTextSizeH5);
	}
	// Hämta nuvarande antal kanaler eller sätt in standard 10 ("nollställningen")
	if (localStorage.getItem('NumberOfChannels')) {
		localStorageNumberOfChannels = parseInt(
			localStorage.getItem('NumberOfChannels')
		);
		document.getElementById('numrows').value = localStorageNumberOfChannels;
	} else {
		localStorageNumberOfChannels = 10;
		localStorage.setItem('NumberOfChannels', localStorageNumberOfChannels);
		document.getElementById('numrows').value = localStorageNumberOfChannels;
	}

	// Hämta in Mörkläge eller Ljusläge.
	if (localStorage.getItem('DarkLightMode')) {
		localStorageDarkLightMode = localStorage.getItem('DarkLightMode');
	} else {
		//Saknas värde, skapa 0 som standard (ljusläge)
		localStorageDarkLightMode = 0;
		localStorage.setItem('DarkLightMode', localStorageDarkLightMode);
	}

	// Kolla om det finn sen nuvarande kanal. Hämta i sådana fall det som sträng
	if (localStorage.getItem('CurrentChannel')) {
		localStorageCurrentChannel = localStorage.getItem('CurrentChannel');
	}

	// Kolla om Tabelläge har en variabel
	if (localStorage.getItem('TableMode')) {
		// Kolla om det är 1, dvs., aktiverat
		if (localStorage.getItem('TableMode') == 1) {
		}
	} else {
		// Sätt det annars till 0, dvs., ej aktiverat eller fel siffra
		localStorage.setItem('TableMode', 0);
	}
}

// Funktion ändrar textstorlek i paragraf- och H5-element i element placerade under #info-diven
function initSize() {
	// Hämta array för alla paragraf- respektive h5-element
	let selectParagraphEl = document.querySelectorAll('#info p');
	let selectH5 = document.querySelectorAll('#info h5');

	// Paragrafelement finns på alla sidor så denna array-loop kan köras utan if-sats
	for (i = 0; i < selectParagraphEl.length; i++) {
		selectParagraphEl[i].style.fontSize = `${localStorageTextSizeP}px`;
		clog.localStorageTextSizeP;
	}
	// På startsidan finns inga H5-element så då körs inte array-loopen
	if (selectH5.length != 0) {
		for (i = 0; i < selectH5.length; i++) {
			selectH5[i].style.fontSize = `${localStorageTextSizeH5}px`;
		}
	}
}

// Funktion som tilldelar bildelementattributer & väljer rätt SR-logga beroende på mörk-/ljusläge
function setLogoImg() {
	welcomeImgEl.setAttribute('width', '450px');
	welcomeImgEl.setAttribute('alt', 'Bild på Sveriges Radio logga');
	welcomeImgEl.setAttribute('title', 'Bild på Sveriges Radio logga');
	if (localStorageDarkLightMode == 0) {
		correctSRImg = srLogoURL;
	} else {
		correctSRImg = srLogoDarkURL;
	}
}

function welcomeMessage() {
	// Positionera sig i info-diven
	let infoDivPos = document.getElementById('info');
	infoDivPos.innerHTML = ''; // Töm först så loadFront() fungerar som det ska

	// Välj rätt SR-logga beroende på mörk-/ljusläge
	setLogoImg();
	welcomeImgEl.setAttribute('src', correctSRImg);

	// Skapa några textelement & slå dem samman
	let welcomeH2El = document.createElement('h2');
	let welcomePEl = document.createElement('p');
	let welcomeH2Node = document.createTextNode(
		'Välkommen webbjtänsten för SR - Sveriges Radio!'
	);
	// Använder innerHTML för att kunna skriva ren HTML-kod för bland annat radbrytningar och användning av icke-numrerade listor.
	welcomePEl.innerHTML = `På denna webbplats kan du unna dig av följande 
	funktioner gällande SR Sveriges Radio:<br>
	<ul><li><i style="font-weight:bold">Nollställ alla inställningar</i> genom att klicka på logotypen 
	"DT084G - Projekt" högst uppe åt höger.</li>
	<li><i style="font-weight:bold">Klicka på den radiokanal</i> under "Bläddra via kanal" som du vill visa 
	nuvarande programtablå för. Den visar då endast program som
	fortfarande sänds eller kommer att sändas fram till och med midnatt.</li>
	<li><i style="font-weight:bold">Justera antalet radiokanaler</i> med uppåt- och nedknapparna efter "Max antal:" eller ange ett heltal i fältet där det står 10.</li>
	<li><i style="font-weight:bold">Justera textstorleken</i> med hjälp av knapparna Text-- och Text++ upp. Det stegrar med 1 pixlar upp till max 20 pixlar (paragraftext) eller ned till 9 pixlar (sändningstid). <br><u>OBS:</u> Endast beskrivning och sändningstid påverkas.</li>
	<li><i style="font-weight:bold">Klicka på Mörkläge</i> om du föredrar att läsa & lyssna i mörkret. Knappen heter Ljusläge som du sedan klickar på för att få tillbaka det ursprungliga utseendet.</li>
	<li><i style="font-weight:bold">Tabelläge</i> låter dig att visa vald radiokanal som en kompakt tabell utan bilder.</li>
	<i style="font-weight:bold">OBS:</i> När du klickar på logotypen uppe åt vänster så nollställs alla inställningar (textstorlek, mörk-/ljusläge, tabelläge, antal visade kanaler och vald radiokanal). De sparas däremot om du bara lämnar hemsidan eller laddar om den på annat vis.</ul>
	<p>Trevlig användning!</p>`;
	welcomeH2El.appendChild(welcomeH2Node);
	infoDivPos.appendChild(welcomeImgEl);
	infoDivPos.appendChild(welcomeH2El);
	infoDivPos.appendChild(welcomePEl);
	initSize(); // Justera textstorlek efter alla DOM-element skapats och skrivits ut
}

/* BONUS-FUNKTION: 2 Knappar som förminskar eller förstorar programtablåns text.
   1 Knapp växlar mellan ljus- & mörkläge. Använder localsStorage(). 1 Knapp
   växlar om till en tabell för nuvarande programtablå så det visas mer kompakt.
*/
function createButtons() {
	// Positionera nedanför Max antal:-fältet
	let numRowsPos = document.getElementById('shownumrows');

	// Knappar är redan skapta i globala variabler så övriga funktioner kommer åt dem
	// Skapa textinnehåll åt knapparna
	btnDecreaseEl.innerHTML = 'Text--';
	btnIncreaseEl.innerHTML = 'Text++';
	tableModeEl.innerHTML = 'Tabelläge';

	// Lite CSS-justeringar för knapparna = mer stilrent
	const similarButtonStyles = `width: 85px; height: 22px`; // DRY-implementering!
	const SBS = similarButtonStyles; // Förkortat namn och hänvisning vill vad förkortningen syftar på
	btnDecreaseEl.style.cssText = SBS;
	btnIncreaseEl.style.cssText = SBS;
	darkModeEl.style.cssText = SBS;
	tableModeEl.style.cssText = SBS;
	btnDecreaseEl.style.marginTop = '10px';
	btnDecreaseEl.style.marginRight = '3px';
	darkModeEl.style.marginRight = '3px';

	// Justera Mörkläge-knappen rätt: Ljusläge annars
	if (localStorageDarkLightMode == 1) {
		DarkMode();
	} else {
		LightMode();
	}

	// Hotfix för FireFox-webbläsare. Om FireFox så justeras knappens vänstra
	// marginal så det ser ut som om knapparna ligger parallellt vertikalt
	let userAgent = navigator.userAgent; // Ta reda på webbläsare
	// Matchning tyder på FireFox? Justera marginal från vänster 12px!
	if (userAgent.match(/firefox|fxios/i)) {
		darkModeEl.style.marginLeft = '12px';
	}

	// Skriv ut knapparna i DOM och tilldela dem händelsehanterare
	numRowsPos.appendChild(btnDecreaseEl);
	numRowsPos.appendChild(btnIncreaseEl);
	numRowsPos.appendChild(darkModeEl);
	numRowsPos.append(tableModeEl);

	// Händelsehanterare: Förminska textstorleken i programtablå
	btnDecreaseEl.addEventListener('click', () => {
		// Aktivera den andra knappen eftersom den nu kan användas minst en gång
		btnIncreaseEl.disabled = false;
		// Markera endast elementen som rör programtablån | LS = localStorage
		let selectParagraphEl = document.querySelectorAll('#info p');
		let selectH5 = document.querySelectorAll('#info h5');

		// Hämtar nuvarande storlek, de returneras som strängar så omvandlar till heltal
		let getLSParagraphSize = parseInt(localStorage.getItem('TextSizeP'));
		let getLSH5Size = parseInt(localStorage.getItem('TextSizeH5'));

		// Avbryter funktion med return efter rimlig minsta textstorlek
		if (parseInt(localStorage.getItem('TextSizeP')) == 9) {
			btnDecreaseEl.disabled = true;
			return;
		}
		// Minska nu siffervariabeln med 1 och loopa igenom alla P-element
		// med det nya värdet. Spara till sist det nya värdet i LS
		getLSParagraphSize--;
		for (i = 0; i < selectParagraphEl.length; i++) {
			selectParagraphEl[i].style.fontSize = `${getLSParagraphSize}px`;
		}
		localStorage.setItem('TextSizeP', getLSParagraphSize); // Lagra & tilldela om
		localStorageTextSizeP = parseInt(localStorage.getItem('TextSizeP'));

		// Loopa endast när det finns h5-rubriker att loopa igenom
		// Justera dock värdet för övriga sidor. Så lagra även nya värdet.
		getLSH5Size--;
		if (selectH5.length != 0) {
			for (i = 0; i < selectParagraphEl.length; i++) {
				selectH5[i].style.fontSize = `${getLSH5Size}px`;
			}
		}
		localStorage.setItem('TextSizeH5', getLSH5Size); // Lagra & tilldela om
		localStorageTextSizeH5 = parseInt(localStorage.getItem('TextSizeH5'));
	});

	// Händelsehanterare: Förstora textstorleken i programtablå
	btnIncreaseEl.addEventListener('click', () => {
		// Aktivera den andra knappen eftersom den nu kan användas minst en gång
		btnDecreaseEl.disabled = false;
		// Markera endast elementen som rör programtablån | LS = localStorage
		let selectParagraphEl = document.querySelectorAll('#info p');
		let selectH5 = document.querySelectorAll('#info h5');

		// Hämtar nuvarande storlek, de returneras som strängar så omvandlar till heltal
		let getLSParagraphSize = parseInt(localStorage.getItem('TextSizeP'));
		let getLSH5Size = parseInt(localStorage.getItem('TextSizeH5'));

		// Avbryter funktion med return efter rimlig största textstorlek
		if (getLSParagraphSize == 20) {
			btnIncreaseEl.disabled = true;
			return;
		}

		getLSParagraphSize++; // Öka nu siffervariabeln med 1
		// Loopa igenom alla ovanmarkerade HTML-element
		// där alla paragrafelement ökar med 1px.
		for (i = 0; i < selectParagraphEl.length; i++) {
			selectParagraphEl[i].style.fontSize = `${getLSParagraphSize}px`;
		}
		localStorage.setItem('TextSizeP', getLSParagraphSize); // Lagra & tilldela om
		localStorageTextSizeP = parseInt(localStorage.getItem('TextSizeP'));
		// Loopa endast när det finns h5-rubriker att loopa igenom
		// Justera dock värdet för övriga sidor. Så lagra även nya värdet.
		getLSH5Size++;
		if (selectH5.length != 0) {
			for (i = 0; i < selectParagraphEl.length; i++) {
				selectH5[i].style.fontSize = `${getLSH5Size}px`;
			}
		}
		localStorage.setItem('TextSizeH5', getLSH5Size); // Lagra & tilldela om
		localStorageTextSizeH5 = parseInt(localStorage.getItem('TextSizeH5'));
	});

	// Händelsehanterare: Växlar mellan mörk och vit bakgrund (motsatt för textfärg)
	darkModeEl.addEventListener('click', () => {
		// Välj och ändra färgen på div som innehåller programtablåerna och menyn
		// Ändrar även knappens textinnehåll så det visar hur man byter tillbaka.
		// Aktivera mörkläge, ändrar även textstorleksknapparna färger
		if (selectContainClass[0].style.backgroundColor != 'black') {
			DarkMode();
		}
		// Aktivera ljusläge "återställ"
		else {
			LightMode();
		}
	});
}

// När Ljusläge-knappen klickas på eller skall laddas in för det var senast använt
// Växlar tillbaka till vit & orange bakgrundsfärg och svart textfärg
function LightMode() {
	selectContainClass[0].style.backgroundColor = 'white';
	document.body.style.color = 'black';
	document.body.style.backgroundColor = '#f4f3f3';
	document.getElementById('mainheader').style.backgroundColor = '#d04900';
	darkModeEl.textContent = 'Mörkläge';
	darkModeEl.style.backgroundColor = 'black';
	darkModeEl.style.color = 'white';
	welcomeImgEl.setAttribute('src', srLogoURL); // Ändra till lämpligare SR-logga
	localStorage.setItem('DarkLightMode', 0); // Lagra inställning i localStorage()
}

// När Mörkläge-knappen klickas på eller skall laddas in för det var senast använt
function DarkMode() {
	selectContainClass[0].style.backgroundColor = 'black';
	document.body.style.color = 'white';
	document.body.style.backgroundColor = '#151515';
	document.getElementById('mainheader').style.backgroundColor = 'black';
	darkModeEl.textContent = 'Ljusläge';
	darkModeEl.style.backgroundColor = 'white';
	darkModeEl.style.color = 'black';
	welcomeImgEl.setAttribute('src', srLogoDarkURL); // Ändra till lämpligare SR-logga
	localStorage.setItem('DarkLightMode', 1); // Lagra inställning i localStorage()
}
/* Funktionen changeNumRows används för att ändra antalet radiokanaler
   som ska visas. Den hämtar värdet från "Max antal:" och skickar vidare
   detta värdeargument till funktionen loadChannels som laddar fram rätt
   antal kanaler.
*/
function changeNumrows() {
	// Hämta värdet från "Max antal:"-fältet
	let getChannelCount = document.getElementById('numrows').value;
	// Gör så att det alltid måste hämtas minst en kanal
	if (getChannelCount == 0) {
		getChannelCount = 1;
		document.getElementById('numrows').value = getChannelCount; // Skriv tillbaka 1 om 0 skrivs in manuellt
		localStorageNumberOfChannels = getChannelCount;
		localStorage.setItem('NumberOfChannels', localStorageNumberOfChannels); // Justera specialfallet i localStorage()
	}
	localStorageNumberOfChannels = getChannelCount;
	localStorage.setItem('NumberOfChannels', localStorageNumberOfChannels);
	loadChannels(getChannelCount); // Lagra i localStorage()
}

/* Funktionen loadChannels hämtar antalet 
   kanaler utifrån parametern numberOfChannels. 
*/
function loadChannels(numberOfChannels) {
	fetch(channelsURL)
		.then((resp) => resp.json())
		.then((data) => {
			document.querySelector('#mainnav ul').innerHTML = '';
			let getChannels = data.channels;

			/* Gör så att antalet kanaler att gå igenomm alltid är = "Max antal:"-värdet
			   med undantaget att antalet kanaler inte får vara högre än antalet som
			   finns tillgängliga i JSON. Om det är högre än vad som finns så visar
			   den bara alla tillgängliga kanaler i JSON 
			   vid API-anropet just då.		   
			*/
			if (numberOfChannels > getChannels.length) {
				getChannels.length = getChannels.length;
				/* I skrivande stund finns det bara 52 radiokanaler så skriver man in 53
			       eller högre eller försöker trycka uppåt så skriver den ut max antalet
			       tillgängliga radiokanaler och skriver in 52 i "Max antal:"-fältet. 
				   Den skriver in så många kanaler som det finns helt enkelt.
				   Den sparar även samma antal i localStorage så rätt antal finns där oxå.
				   */
				localStorageNumberOfChannels = getChannels.length;
				localStorage.setItem('NumberOfChannels', localStorageNumberOfChannels);
				document.getElementById('numrows').value = getChannels.length;
			} else {
				getChannels.length = numberOfChannels;
			}
			// Loopa igenom tillgängliga kanaler utifrån antalet erhållet från getChannels.length
			for (i = 0; i < getChannels.length; i++) {
				// Positionera sig vid ul-elementet
				let channelUlPos = document.querySelector('#mainnav ul');
				// Skapa och skriv ut <li> element i DOM
				let channelliEl = document.createElement('li');
				channelUlPos.appendChild(channelliEl);

				// Skapa ett <a>-element och för in attributer med attributvärden
				let createSpanel = document.createElement('span');
				let createSpanText = document.createTextNode(getChannels[i].name);

				// Om kanalen saknar programtablå, dvs., scheduleurl ÄR null så tilldela ett värde som skickas vidare
				if (getChannels[i].scheduleurl == null) {
					// Om länk INTE finns så döp till #empty
					createSpanel.setAttribute('href', '#empty');
				} else {
					// Om länk finns så gör till vanlig ankare
					createSpanel.setAttribute('href', '#');
				}

				// Sätt title= och style= egenskapern för <a>-elementet
				createSpanel.setAttribute('title', `${getChannels[i].tagline}`);
				createSpanel.setAttribute('style', `color:#${getChannels[i].color};`);

				// Slå samman <a>-element och skriv ut i DOM
				createSpanel.appendChild(createSpanText);
				channelliEl.appendChild(createSpanel);

				// Lagrar särskild länk som skickar lämpligt API-anrop till API:n vid klick
				let channelLink; // Förbered variabel
				// Om ingen länk till programtablå finns så skicka #empty att spara i ett givet länkattribut
				if (getChannels[i].scheduleurl == null) {
					channelLink = '#empty';
				} else {
					// Annars skicka faktiska radiokanalens API-länk
					channelLink = `${getChannels[i].scheduleurl}&format=json&pagination=false`;
				}
				// Skapa nu klickbaserad händelsehanterare för radiokanalen ifråga
				createSpanel.addEventListener(
					'click',
					() => {
						fetchChannelData(channelLink);
						localStorage.setItem('CurrentChannel', channelLink);
						initSize(); // Kolla lagrad textstorlek i localStorage
					},
					false
				);
			}
		})
		.catch();
}

/*  Felmeddelande-funktion när särskild scheduleurl saknas i JSON 
    eller när det blir misslyckad fetch() så att catch() anropas.
    Denna funktion anropas vid tre olika situationer så den
	blev lämplig att inkludera här för att leva DRY-livet! */
function showErrorMessage(errormsg) {
	// Positionera sig vid info-sektionselementet i DOM
	let infoDivPos = infoDivConst;
	infoDivPos.innerHTML = '';
	// Skapa felmeddelande-element & textnoder med inspiration från Destructuring Assignment
	let [
		createArticleErrorEl,
		createErrorH3El,
		createErrorPEl,
		createErrorH3Node,
		createErrorPNode,
	] = [
		document.createElement('article'),
		document.createElement('h3'),
		document.createElement('p'),
		document.createTextNode('Radiokanalens programtablå saknas!'),
		document.createTextNode(errormsg),
	];
	// Slå samman felmeddelande-element & textnoder
	createArticleErrorEl.appendChild(createErrorH3El);
	createErrorH3El.appendChild(createErrorH3Node);
	createErrorPEl.appendChild(createErrorPNode);
	// samt skriv ut i DOM
	infoDivPos.appendChild(createArticleErrorEl);
	createArticleErrorEl.appendChild(createErrorH3El);
	createArticleErrorEl.appendChild(createErrorPEl);
}

// Hämtar programtablå från via vald kanal med hjälp av variabeln "channelURL"
function fetchChannelData(channelURL) {
	/* Kanaler som saknar programtablå visar felmeddelande 
	   om att programtablå saknas för radiokanalen för närvarande */
	if (channelURL == '#empty') {
		showErrorMessage(
			'För närvarande finns det ingen programtablå för denna radiokanal'
		);
	} else {
		// Hämta data med fetch API och omvandla svaret (resp) till JSON-fil som lagras i variabeln (data)
		fetch(channelURL)
			.then((resp) => resp.json())
			.then((data) => {
				let getSchedule = data.schedule; // Från getSchedule hämtas data från JSON-data

				// Positionera där alla skapta element & deras innehåll förs in
				let infoDivPos = infoDivConst;
				infoDivPos.innerHTML = ''; // Töm först

				// Skapa element, textnoder & skriv ut dagens programtablå för radiokanalen
				for (i = 0; i < getSchedule.length; i++) {
					/* Hämta dagens tid och jämför mot programtablåns tider så 
                   endast dagens (fram t.o.m. sluttid 00:00) program listas.
                */
					let timeNow = Date.now();
					if (timeNow < checkDate(data.schedule[i].starttimeutc)) {
						// Skapa alla element enligt obligatoriska instruktioner
						let newArticleEl = document.createElement('article');
						let newProgamTitleH3El = document.createElement('h3');
						let newSubtitleH4El = document.createElement('h4');
						let newDurationH5El = document.createElement('h5');
						let newImgEl = document.createElement('img');
						let newDescriptionPEl = document.createElement('p');

						// Skapa textnoder åt elementen eligt obligatoriska instruktioner
						let newProgramTitleNode = document.createTextNode(
							getSchedule[i].title
						);
						let newSubtitleNode = document.createTextNode(
							getSchedule[i].subtitle
						);
						let newDescriptionNode = document.createTextNode(
							getSchedule[i].description
						);
						/* Skapa textnod för start- & sluttid i formatet HH:MM - HH:MM
                       med hjälp av funktionen dateConverter() som tar två parametrar*/
						let newDurationNode = document.createTextNode(
							dateConverter(
								getSchedule[i].starttimeutc,
								getSchedule[i].endtimeutc
							)
						);

						// Skapa imagelänk och dess egenskaper som källa, bredd och finare kanter
						// Använd SR-logga som standard när bild inte finns, den mörka endast.
						if (getSchedule[i].imageurl == undefined) {
							newImgEl.setAttribute('src', srLogoDarkURL);
						} else {
							newImgEl.setAttribute('src', getSchedule[i].imageurl);
						}

						// Egenskaper som gäller bilderna oavsett bild saknas eller ej
						newImgEl.setAttribute('width', '200px');
						newImgEl.style.borderRadius = '10px';

						// Slå ihop skapade HTML-element med deras textnoder
						newProgamTitleH3El.appendChild(newProgramTitleNode);
						newSubtitleH4El.appendChild(newSubtitleNode);
						newDurationH5El.appendChild(newDurationNode);
						newDescriptionPEl.appendChild(newDescriptionNode);

						// Skriv ut de sammanslagna delarna i obligatorisk ordning i DOM
						infoDivPos.appendChild(newArticleEl);
						newArticleEl.appendChild(newProgamTitleH3El);

						// Skriv ut undertitel i DOM endast om den finns i JSON
						// Många titlar saknar undertitlar i programtablåerna
						if (getSchedule[i].subtitle != null) {
							newArticleEl.appendChild(newSubtitleH4El);
						}

						// Skriv ut övriga element i DOM
						newArticleEl.appendChild(newDurationH5El);
						newArticleEl.appendChild(newImgEl);

						// Skriv ut beskrivning i DOM endast om innehåll finns
						// Ibland är det endast titel och start- & sluttid i programtablån
						if (getSchedule[i].description != '') {
							newArticleEl.appendChild(newDescriptionPEl);
						}
					}
				}
				initSize(); // Justera textstorlek (h5 och p) efter alla element skapats och skrivits ut i DOM

				/* Felmeddelande som visas som resultat av att ingen
				   inre HTML-kod hittades. Detta kan bara inträffa när
				   vissa radiokanaler saknar all slags data som försöks
				   hämtas och skapas HTML-element utifrån. Då detta körs
				   direkt efter hela loopen så blir det nästan garanterat
				   att det bara visas när faktiskt ingen data kunde hämtas.
				*/
				if (infoDivPos.innerHTML == '') {
					showErrorMessage(`Denna radiokanal kanske har sändningsuppehåll eller så finns den ej
					tillgänglig att visas i det format som denna Webbtjänst kräver.`);
				}
			})
			/* Vid felmeddelande när särskild scheduleurl-länk inte finns (eller 
		       är felaktig från API - leverantörens sida) så visas detta: */
			.catch(() => {
				showErrorMessage(`Denna radiokanal verkar inte existera längre eller så är 
				det felaktig adress angiven från SR - Sveriges Radios sida.`);
			});
	}
}

/* Funktionen dateConverter behövs för erhållna datum är 
   i epoktid och måste omvandlas till timmar & minuter.
   Funktionen returnerar i formatet starttid HH:MM - sluttid HH:MM */
function dateConverter(epochStart, epochEnd) {
	/* Längst inuti Date()-funktionen så börja med att 
       kapa 6 tecken i början & 2 tecken i slutet för
       start- respektive sluttidens textsträngar. Dessa
       omvandlas sedan med hjälp av parseInt()-funktionen
       till heltal vilket i sin tur förvandlas till
       standarformatet för tid med hjälp av Date{}-objektet. 
    */
	// Skapa två datumobjekt för start- respektive sluttid
	let convertEpochTimeStart = new Date(parseInt(epochStart.slice(6, -2)));
	let convertEpochTimeEnd = new Date(parseInt(epochEnd.slice(6, -2)));

	// En inre funktion då samma sak ska göras två ggr = DRY!
	function getHoursAndMinutes(getHaM) {
		//Hämta timmar & minuter, gör båda dubbelsiffriga för start- & sluttid
		let getHours = getHaM.getHours();
		let getMinutes = getHaM.getMinutes();
		if (getHours < 10) {
			getHours = '0' + getHours;
		}
		if (getMinutes < 10) {
			getMinutes = '0' + getMinutes;
		}
		// Returnera i formatet HH:MM
		return `${getHours}:${getMinutes}`;
	}
	// Returnera i formatet HH:MM - HH:MM
	return `${getHoursAndMinutes(convertEpochTimeStart)} - ${getHoursAndMinutes(
		convertEpochTimeEnd
	)}`;
}

/* Funktionen checkDate behövs för att kolla om startdatumet
   för ett radioprogram är senare eller än nuvarande tid.
   Den tar starttiden (starttimeutc) och omvandlar till epoch
   och returnerar ett heltal som kan jämföras mot dagens tid i heltal.
*/
function checkDate(StartTime) {
	// Kapa 6 tecken i början & 2 i slutet och omvandla till ett heltal
	let CheckTime = parseInt(StartTime.slice(6, -2));
	return CheckTime;
}
