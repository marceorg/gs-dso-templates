// Funciones Generales
function fGetURLSvc(svc, method, params) {
	return "/PublicadorIns-Front/RPCAdapter/httprpc/" + svc + "?cache="
			+ fGetCacheRnd();
}

function fGetURLSvcPost(svc, method, params) {
	return "/PublicadorIns-Front/RPCAdapter/httprpc/" + svc;
}

function fGetCacheRnd() {
	return Math.floor((Math.random() * 100000) + 1);
}

function fGetURLPag(pag) {
	return "/PublicadorIns-Front/pages/" + pag;
}

function fGetIcon(image) {
	var vRet = "";
	if (image.toUpperCase() == "E") {
		vRet = fGetURLPag("images/icoError.png");
	} else if (image.toUpperCase() == "W") {
		vRet = fGetURLPag("images/icoWarning.png");
	} else if (image.toUpperCase() == "I") {
		vRet = fGetURLPag("images/icoInfo.png");
	} else if (image.toUpperCase() == "O") {
		vRet = fGetURLPag("images/icoOK.png");
	} else if (image.toUpperCase() == "N") {
		vRet = fGetURLPag("images/icoNo.png");
	} else if (image.toUpperCase() == "A") {
		vRet = fGetURLPag("images/icoWait.gif");
	} else if (image.toUpperCase() == "Q") {
		vRet = fGetURLPag("images/icoQuestion.png");
	}

	return vRet;
}

function fGetParamURL(param) {
	var vURL = dijit.byId("divContent").get("href");
	var vPos = vURL.indexOf(param);
	var vRet = "";
	if (vPos > -1) {
		var vLen = vURL.indexOf("&", vPos);
		if (vLen == -1) {
			vLen = vURL.length - vPos;
		} else {
			vLen = vLen - vPos;
		}
		vRet = vURL.substr(vPos, vLen);
	}
	return vRet;
}

function fGetParURL(param) {
	var vURL = window.location.href;
	var vPos = vURL.indexOf(param);
	var vRet = "";
	if (vPos > -1) {
		var vLen = vURL.indexOf("&", vPos);
		if (vLen == -1) {
			vLen = vURL.length - vPos;
		} else {
			vLen = vLen - vPos;
		}
		vRet = vURL.substr(vPos, vLen);
	}
	return vRet;
}

function fSessionClose() {
	document.frmMain.action = "/PublicadorIns-Front/ibm_security_logout?logoutExitPage=login.html";
	document.frmMain.submit();
}

function fSessionValidate(vFnct) {
	// Verificar Perfil
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("PublicadorService/getFechaHoy");
		var deferred = request.get(vURL, {
			handleAs : "json"
		});

		deferred.then(function(response) {
			if (response.error || !response.result) {
				document.frmMain.action = "/PublicadorIns-Front/#";
				document.frmMain.submit();
			} else {
				eval(vFnct + "()");
			}
		}, function(err) {
			document.frmMain.action = "/PublicadorIns-Front/#";
			document.frmMain.submit();
		});
	});
}

function fSessionVoid() {
	// No hacer nada
}

function fBrowserValidate() {
	try {
		var vTest = JSON.stringify(null);
		return true;
	} catch (err) {
		return false;
	}

	// Verificar si es FF, Ch, o IE
	/*
	 * var is_ff = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
	 * var is_ch = navigator.userAgent.toLowerCase().indexOf('chrome') > -1; var
	 * is_ie = navigator.userAgent.toLowerCase().indexOf('msie') > -1; if (is_ff ||
	 * is_ch || is_ie) { return true; } else { return false; }
	 */
}

function fBrowserHeight() {
	var vHeight = 0;
	if (typeof (window.innerWidth) == 'number') {
		// Non-IE
		vHeight = window.innerHeight;
	} else if (document.documentElement
			&& (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
		// IE 6+ in 'standards compliant mode'
		vHeight = document.documentElement.clientHeight;
	} else if (document.body
			&& (document.body.clientWidth || document.body.clientHeight)) {
		// IE 4 compatible
		vHeight = document.body.clientHeight;
	}
	return vHeight;
}

function fBrowserWidth() {
	var vWidth = 0;

	if (typeof (window.innerWidth) == 'number') {
		// Non-IE
		vWidth = window.innerWidth;
	} else if (document.documentElement
			&& (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
		// IE 6+ in 'standards compliant mode'
		vWidth = document.documentElement.clientWidth;
	} else if (document.body
			&& (document.body.clientWidth || document.body.clientHeight)) {
		// IE 4 compatible
		vWidth = document.body.clientWidth;
	}
	return vWidth;
}

function fBrowserResize() {
	// Tomar tamanos
	var vHeight = fBrowserHeight();
	// Main
	if ((vHeight - 165) > 0) {
		document.getElementById("divContent").style.height = String((vHeight - 165))
				+ "px";
	} else {
		document.getElementById("divContent").style.height = "0px";
	}
	// Determino tamanos
	var vContHeight = "";
	if ((vHeight - 221) > 0) {
		vContHeight = String((vHeight - 221));
	} else {
		vContHeight = "0";
	}
	// Sitios
	if (document.getElementById("divSITCont")) {
		document.getElementById("divSITCont").style.height = vContHeight + "px";
	}
	// Destacados
	if (document.getElementById("divDESCont")) {
		document.getElementById("divDESCont").style.height = vContHeight + "px";
	}
	// Banners
	if (document.getElementById("divBANCont")) {
		document.getElementById("divBANCont").style.height = vContHeight + "px";
	}
	// T.Acceso
	if (document.getElementById("divTACCont")) {
		document.getElementById("divTACCont").style.height = vContHeight + "px";
	}
}

function fFormatFill(pValor, pTamano, pValorRelleno, pLeftRight) {
	var wRelleno = "";
	var wResult = "";

	if (!pValorRelleno) {
		pValorRelleno = "0";
	}
	if (!pLeftRight) {
		pLeftRight = "R";
	}

	for (var wCont = 1; wCont <= pTamano; wCont++) {
		wRelleno += pValorRelleno;
	}

	if (pLeftRight == "R") {
		wResult = wRelleno.concat(pValor);
		wResult = wResult.substr(wResult.length - pTamano, pTamano);
	} else {
		wResult = pValor.concat(wRelleno);
		wResult = wResult.substr(0, pTamano);
	}

	return wResult;
}

function fFormatClearSpaces(pCadena) {
	return pCadena.replace(/\s+/g, " ");
}

function fFormatNxF(pNumero) {
	if (pNumero.length != 8) {
		return "";
	} else {
		return pNumero.substr(6, 2) + "/" + pNumero.substr(4, 2) + "/"
				+ pNumero.substr(0, 4);
	}
}

function fFormatFxN(pFecha) {
	var partesFecha = String(pFecha).split("/");
	var fecRes = '';

	if (partesFecha.length == 3)
		fecRes = fFormatFill(partesFecha[2], 4)
				+ fFormatFill(partesFecha[1], 2)
				+ fFormatFill(partesFecha[0], 2);
	else
		fecRes = '0';

	return fecRes;
}

function fFormatDTB(pNumero) {
	vNumero = String(pNumero);
	if (vNumero.length != 8) {
		return null;
	} else {
		return vNumero.substr(0, 4) + "-" + vNumero.substr(4, 2) + "-"
				+ vNumero.substr(6, 2);
	}
}

function toUpperCaseFirst(string) {
	var pieces = string.split(" ");
	for (var i = 0; i < pieces.length; i++) {
		var j = pieces[i].charAt(0).toUpperCase();
		pieces[i] = j + pieces[i].substr(1).toLowerCase();
	}
	return pieces.join(" ");
}

function fDateAdd(pDate, pDays) {
	var vYY = parseInt(pDate.substr(0, 4), 10);
	var vMM = parseInt(pDate.substr(4, 2), 10) - 1;
	var vDD = parseInt(pDate.substr(6, 2), 10);
	var vDate = new Date(vYY, vMM, vDD);
	vDate.setDate(vDate.getDate() + pDays);
	return (dojo.date.locale.format(vDate, {
		datePattern : "yyyyMMdd",
		selector : "date"
	}));
}

function fDestroyElement(elementId) {
	var attachedWidget = dijit.byId(elementId);
	if (attachedWidget) {
		attachedWidget.destroy();
		attachedWidget = null;
	}
}

function fComboLoad(vJSON, vCbo) {
	var oCbo = dijit.byId(vCbo);

	// Cargar uno blanco
	var oOpt = {};
	oOpt.label = "";
	oOpt.value = "";
	oOpt.selected = true;
	oCbo.addOption(oOpt);

	// Cargar combo
	for ( var i in vJSON.result) {
		var oOpt = {};
		oOpt.label = vJSON.result[i].name;
		oOpt.value = String(vJSON.result[i].id);
		oOpt.selected = false;
		oCbo.addOption(oOpt);
	}
}

function fComboAdd(vCbo, vJSON) {
	var oCbo = dijit.byId(vCbo);

	// Cargar uno blanco
	var oOpt = {};
	oOpt.label = "";
	oOpt.value = "";
	oOpt.selected = true;
	oCbo.addOption(oOpt);

	var oOpt = {};
	oOpt.label = vJSON.name;
	oOpt.value = String(vJSON.id);
	oOpt.selected = false;
	oCbo.addOption(oOpt);
}

function fComboClean(vCbo) {
	var oCbo = dijit.byId(vCbo);

	dojo.forEach(oCbo.getOptions(), function(opt, i) {
		oCbo.removeOption(opt);
	});

	// Para que borre el actual
	oCbo._setDisplay("");
}

function fComboAllLoad(vJSON, vCbo, vLey, vVal, vJoin) {
	var oCbo = dijit.byId(vCbo);

	if (!vLey) {
		vLey = "TODOS";
	}
	if (!vVal) {
		vVal = "0";
	}

	// Cargar uno en todos
	var oOpt = {};
	oOpt.label = vLey;
	oOpt.value = vVal;
	oOpt.selected = true;
	oCbo.addOption(oOpt);

	// Cargar combo
	for ( var i in vJSON.result) {
		var oOpt = {};
		if (vJoin) {
			oOpt.label = String(vJSON.result[i].id) + " - "
					+ vJSON.result[i].name;
		} else {
			oOpt.label = vJSON.result[i].name;
		}
		oOpt.value = String(vJSON.result[i].id);
		oOpt.selected = false;
		oCbo.addOption(oOpt);
	}
}

function fComboLoadSitio(vJSON, vCbo) {
	var oCbo = dijit.byId(vCbo);

	// Cargar uno blanco
	var oOpt = {};
	oOpt.label = "";
	oOpt.value = "";
	oOpt.selected = true;
	oCbo.addOption(oOpt);

	// Cargar combo
	for ( var i in vJSON.result) {
		var oOpt = {};
		oOpt.label = "[" + String(vJSON.result[i].id) + "] "
				+ vJSON.result[i].nombre;
		oOpt.value = String(vJSON.result[i].id);
		oOpt.selected = false;
		oCbo.addOption(oOpt);
	}
}

function fComboLoadDestacado(vJSON, vCbo) {
	var oCbo = dijit.byId(vCbo);

	// Cargar uno blanco
	var oOpt = {};
	oOpt.label = "";
	oOpt.value = "";
	oOpt.selected = true;
	oCbo.addOption(oOpt);

	// Cargar combo
	for ( var i in vJSON.result) {
		var oOpt = {};
		oOpt.label = "[" + String(vJSON.result[i].id) + "] "
				+ vJSON.result[i].titulo;
		oOpt.value = String(vJSON.result[i].id);
		oOpt.selected = false;
		oCbo.addOption(oOpt);
	}
}

function fGridClean(vGrid) {
	var oGridClean = dijit.byId(vGrid);
	if (oGridClean) {
		var vEmptyStore = new dojo.data.ItemFileReadStore({
			data : {
				identifier : "",
				items : []
			}
		});
		var oGridClean = dijit.byId(vGrid);
		oGridClean.setStore(vEmptyStore);
	}
}

function fDgrColTDo(value) {
	return value.name;
}

function fDgrColBln(value) {
	var vBln = "";
	if (value) {
		vBln = "Si";
	} else {
		vBln = "No";
	}
	return vBln;
}

function fDgrColSyN(value) {
	var vBln = "";
	if (String(value) == "1") {
		vBln = "Si";
	} else {
		vBln = "No";
	}
	return vBln;
}

function fDgrColLnk(value) {
	var vBln = "";
	if (String(value) == "1") {
		vBln = "DESTACADO";
	} else {
		vBln = "EXTERNO";
	}
	return vBln;
}

function fDgrColFec(value) {
	return fFormatNxF(String(value));
}

function fDgrColSex(value) {
	var vSex = "";
	if (value == "F") {
		vSex = "FEMENINO";
	} else if (value == "M") {
		vSex = "MASCULINO";
	}
	return vSex;
}

function fDgrColTND(value) {
	var vTND = "";
	vTND = value[0] + " " + value[1];
	return vTND;
}

function fDgrColDec(value) {
	return value.toFixed(2);
}

function fDgrColCUI(value) {
	var vCUI = String(value);
	if (vCUI.length == 11) {
		vCUI = vCUI.substr(0, 2) + "-" + vCUI.substr(2, 8) + "-"
				+ vCUI.substr(10, 1);
	}
	return vCUI;
}

function fValType(vType, vData) {
	var vRet = true;
	var vSetChar = "";

	if (vType == 'A') {
		// Alfabetico
		vSetChar = "abcdefghijklmn" + String.fromCharCode(241)
				+ "opqrstuvwxyzABCDEFGHIJKLMN" + String.fromCharCode(209)
				+ "OPQRSTUVWXYZ" + String.fromCharCode(225)
				+ String.fromCharCode(233) + String.fromCharCode(237)
				+ String.fromCharCode(243) + String.fromCharCode(250)
				+ String.fromCharCode(193) + String.fromCharCode(201)
				+ String.fromCharCode(205) + String.fromCharCode(211)
				+ String.fromCharCode(218) + " '";
		for (var i = 0; i < vData.length; i++) {
			if (vSetChar.indexOf(vData.charAt(i)) == -1) {
				vRet = false;
				break;
			}
		}
	} else if (vType == 'R') {
		// Texto restingido
		vSetChar = "abcdefghijklmn" + String.fromCharCode(241)
				+ "opqrstuvwxyzABCDEFGHIJKLMN" + String.fromCharCode(209)
				+ "OPQRSTUVWXYZ" + String.fromCharCode(225)
				+ String.fromCharCode(233) + String.fromCharCode(237)
				+ String.fromCharCode(243) + String.fromCharCode(250)
				+ String.fromCharCode(193) + String.fromCharCode(201)
				+ String.fromCharCode(205) + String.fromCharCode(211)
				+ String.fromCharCode(218) + " '0123456789.,+-*/%$#()=";
		for (var i = 0; i < vData.length; i++) {
			if (vSetChar.indexOf(vData.charAt(i)) == -1) {
				vRet = false;
				break;
			}
		}
	} else if (vType == 'T') {
		// Texto
		vSetChar = "abcdefghijklmn" + String.fromCharCode(241)
				+ "opqrstuvwxyzABCDEFGHIJKLMN" + String.fromCharCode(209)
				+ "OPQRSTUVWXYZ" + String.fromCharCode(225)
				+ String.fromCharCode(233) + String.fromCharCode(237)
				+ String.fromCharCode(243) + String.fromCharCode(250)
				+ String.fromCharCode(193) + String.fromCharCode(201)
				+ String.fromCharCode(205) + String.fromCharCode(211)
				+ String.fromCharCode(218) + String.fromCharCode(228)
				+ String.fromCharCode(235) + String.fromCharCode(239)
				+ String.fromCharCode(246) + String.fromCharCode(252)
				+ String.fromCharCode(196) + String.fromCharCode(203)
				+ String.fromCharCode(207) + String.fromCharCode(214)
				+ String.fromCharCode(220) + " '0123456789@.:,;-_()/&|"
				+ String.fromCharCode(176) + String.fromCharCode(172)
				+ String.fromCharCode(191) + "?" + String.fromCharCode(161)
				+ "!" + String.fromCharCode(168) + String.fromCharCode(180)
				+ "<>#$%=*+{}[]`\"\\\n\t";
		for (var i = 0; i < vData.length; i++) {
			if (vSetChar.indexOf(vData.charAt(i)) == -1) {
				vRet = false;
				break;
			}
		}
	} else if (vType == 'M') {
		// eMail
		vSetChar = "&";
		for (var i = 0; i < vSetChar.length; i++) {
			if (vData.indexOf(vSetChar.charAt(i)) > -1) {
				vRet = false;
				break;
			}
		}
		if (vRet) {
			vRet = fValEMail(vData);
		}
	}

	return vRet;
}

function fValCUIT(vCUIT) {
	var v2 = 0;
	var v3 = 0;
	if (!isNaN(vCUIT)) {
		v2 = (Number(vCUIT.substr(0, 1)) * 5 + Number(vCUIT.substr(1, 1)) * 4
				+ Number(vCUIT.substr(2, 1)) * 3 + Number(vCUIT.substr(3, 1))
				* 2 + Number(vCUIT.substr(4, 1)) * 7
				+ Number(vCUIT.substr(5, 1)) * 6 + Number(vCUIT.substr(6, 1))
				* 5 + Number(vCUIT.substr(7, 1)) * 4
				+ Number(vCUIT.substr(8, 1)) * 3 + Number(vCUIT.substr(9, 1)) * 2) % 11;
		v3 = 11 - v2;
		switch (v3) {
		case 11:
			v3 = 0;
			break;
		case 10:
			v3 = 9;
			break;
		}
		return Number(vCUIT.substr(10, 1)) == v3;
	} else {
		return false;
	}
}

function fValEMail(vEMail) {
	vPosArroba = vEMail.indexOf("@");
	if (vPosArroba > 0) {
		vPosPunto = vEMail.indexOf(".", vPosArroba);
		if (vPosPunto > (vPosArroba + 1)) {
			if (vPosPunto < (vEMail.length - 1)) {
				return true;
			}
		}
	}

	return false;
}

function fEncodeURI(vCadena) {
	// Convertir & en ~~
	vCadena = vCadena.replace(/&/g, "~~");
	// Convertir # en ^^
	vCadena = vCadena.replace(/#/g, "^^");
	// Convertir + en ``
	vCadena = vCadena.replace(/\+/g, "``");
	// Encode URI
	return encodeURI(vCadena);
}
