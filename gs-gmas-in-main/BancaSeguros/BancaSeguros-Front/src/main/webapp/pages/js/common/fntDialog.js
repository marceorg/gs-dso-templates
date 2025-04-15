// Funciones Dialog

function fMsgBox(message, title, image) {
	document.getElementById("lblMsgBox").innerHTML = message;
	if (title) {
		dijit.byId("dlgMsgBox").set("title", title);
	}
	if (image) {
		document.getElementById("imgMsgBox").style.display = "";
		document.getElementById("imgMsgBox").src = fGetIcon(image);
	} else {
		document.getElementById("imgMsgBox").style.display = "none";
	}
	dijit.byId("dlgMsgBox").show();
}

function fQstBox(message, fnct) {
	document.getElementById("lblQstBox").innerHTML = message;
	document.getElementById("hQstBoxFnc").value = fnct;
	dijit.byId("dlgQstBox").show();
}

function fQstBoxYes() {
	dijit.byId('dlgQstBox').onCancel();
	eval(document.getElementById("hQstBoxFnc").value);
}

// Impresos QBE
function fQBEBox(message) {
	document.getElementById("lblQBEBox").innerHTML = message;
	dijit.byId("dlgQBEBox").show();
}

function fQBEBoxPol() {
	eval(document.getElementById("hQBEBoxFnc").value + ",'0')");
}

function fQBEBoxMer() {
	eval(document.getElementById("hQBEBoxFnc").value + ",'2')");
}

function fQBEImprimeQBE(vPoliza, vEndoso, vOrden) {
	window.open(fGetURLMVC("retrieveSvc.html?" + "cache=" + fGetCacheRnd()
			+ "&tipo=P&" + "orden=" + vOrden + "&poliza=" + vPoliza + "-"
			+ vEndoso), "retrieve",
			"resizable=yes,height=550,width=750,top=50,left=100");
}

// Fin QBE
function fCPFinder(vCtrl) {
	fSessionValidate("fSessionVoid");

	var pCal = dijit.byId("txt" + vCtrl + "DirCalle");
	var pLoc = dijit.byId("txt" + vCtrl + "DirLocal");
	var pNum = dijit.byId("txt" + vCtrl + "DirNumero");
	var pPro = dijit.byId("cbo" + vCtrl + "DirProv");
	// var pCPo = dijit.byId("txt" + vCtrl + "DirCP");

	// Guardo los nombres de los controles
	document.getElementById("hCal").value = "txt" + vCtrl + "DirCalle";
	document.getElementById("hLoc").value = "txt" + vCtrl + "DirLocal";
	document.getElementById("hNum").value = "txt" + vCtrl + "DirNumero";
	document.getElementById("hPro").value = "cbo" + vCtrl + "DirProv";
	document.getElementById("hCPo").value = "txt" + vCtrl + "DirCP";

	if (pPro.get("value") == "")
		return;

	var vCalLoc = "";
	if (pPro.get("value") == "1") {
		if (pCal.get("value") == "")
			return;
		if (pNum.get("value") == "")
			return;
		vCalLoc = pCal.get("value");
		document.getElementById("lblCPFBusq").innerHTML = "Calle:";
	} else {
		if (pLoc.get("value") == "")
			return;
		vCalLoc = pLoc.get("value");
		document.getElementById("lblCPFBusq").innerHTML = "Localidad:";
	}

	dijit.byId("txtCPFBusq").set("value", vCalLoc);
	fCPFinderTable(true, pPro.get("value"), vCalLoc);
	dijit.byId("dlgCPFinder").show();
}

function fCPFinderBuscar() {
	fCPFinderTable(false, dijit.byId(document.getElementById("hPro").value)
			.get("value"), dijit.byId("txtCPFBusq").get("value"));
}

function fCPFinderTable(vAuto, vPro, vCalLoc) {
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileReadStore", "dojo/domReady!" ],

	function(request, DataGrid, ItemFileReadStore) {
		var url = fGetURLSvc("CPFinderService/getCPList?provincia=" + vPro
				+ "&calleLoc=" + vCalLoc);
		var deferred = request.get(url, {
			handleAs : "json"
		});

		deferred.then(function(response) {
			if (vAuto) {
				fCPFinderAuto(response, vPro);
			}

			var newData = {
				items : response.result
			};
			var jsonDataSource = new ItemFileReadStore({
				data : newData
			});

			if (vPro == "1") {
				var layout = [ [ {
					name : "CP",
					field : "codigoPostal",
					width : "30px"
				}, {
					name : "Calle",
					field : "calle",
					width : "160px"
				}, {
					name : "Desde",
					field : "alturaDesde",
					width : "47px"
				}, {
					name : "Hasta",
					field : "alturaHasta",
					width : "47px"
				} ] ];
			} else {
				var layout = [ [ {
					name : "CP",
					field : "codigoPostal",
					width : "30px"
				}, {
					name : "Localidad",
					field : "calle",
					width : "300px"
				} ] ];
			}

			if (dijit.byId("dgrCPFinder") == null) {
				grid = new DataGrid({
					id : "dgrCPFinder",
					store : jsonDataSource,
					structure : layout,
					rowSelector : "25px",
					rowCount : 20,
					selectionMode : "single",
					onRowDblClick : function(e) {
						var vCPo = grid.store.getValue(
								grid.getItem(e.rowIndex), "codigoPostal");
						var vCal = grid.store.getValue(
								grid.getItem(e.rowIndex), "calle");
						fCPFinderSel(vCal, vCPo);
					}
				}, "_divCPFinder");

				grid.startup();
			} else {
				dijit.byId("dgrCPFinder").setStructure(layout);
				dijit.byId("dgrCPFinder").setStore(jsonDataSource);
			}
		});
	});
}

function fCPFinderAuto(vJSON, vPro) {
	// Verificar si hay un solo CP para la localidad o calle-altura
	if (vPro == "1") {
		var vNum = parseInt(dijit.byId(document.getElementById("hNum").value)
				.get("value"));
		var vCal = '';
		var vCPo = '';
		var vEnc = 0;

		for ( var i in vJSON.result) {
			if (parseInt(vJSON.result[i].alturaDesde) <= vNum
					&& parseInt(vJSON.result[i].alturaHasta) >= vNum) {
				vCal = vJSON.result[i].calle;
				vCPo = vJSON.result[i].codigoPostal;
				vEnc++;
			}
		}
		if (vEnc == 1) {
			fCPFinderSel(vCal, vCPo);
		}
	} else {
		if (vJSON.result.length == 1) {
			fCPFinderSel(vJSON.result[0].calle, vJSON.result[0].codigoPostal);
		}
	}
}

function fCPFinderSel(vCal, vCPo) {
	if (dijit.byId(document.getElementById("hPro").value).get("value") == "1") {
		// CABA
		dijit.byId(document.getElementById("hCal").value).set("value", vCal,
				false);
	} else {
		dijit.byId(document.getElementById("hLoc").value).set("value", vCal,
				false);
	}
	dijit.byId(document.getElementById("hCPo").value).set("value", vCPo);
	dijit.byId('dlgCPFinder').onCancel();
}

function fCPClean(vCtrl, vCalleLoc) {
	var oPro = dijit.byId("cbo" + vCtrl + "DirProv");
	var oCPo = dijit.byId("txt" + vCtrl + "DirCP");
	var oCal = dijit.byId("txt" + vCtrl + "DirCalle");
	var oNro = dijit.byId("txt" + vCtrl + "DirNumero");
	var oLoc = dijit.byId("txt" + vCtrl + "DirLocal");

	if (oPro.get("value") == "1") {
		// CABA
		if (vCalleLoc == "C") {
			if (oCal.get("value") != oCal.get("origValue")
					|| oNro.get("value") != oNro.get("origValue")) {
				oCPo.set("value", 0);
			}
		}
	} else {
		if (vCalleLoc == "L") {
			if (oLoc.get("value") != oLoc.get("origValue")) {
				oCPo.set("value", 0);
			}
		}
	}
}

function fCPProvSel(vCtrl) {
	var oPro = dijit.byId("cbo" + vCtrl + "DirProv");
	var oLoc = dijit.byId("txt" + vCtrl + "DirLocal");
	var oCPo = dijit.byId("txt" + vCtrl + "DirCP");

	if (oPro.get("value") == "1") {
		// CABA
		oLoc.set("value", "CAPITAL FEDERAL", false);
		oLoc.set("disabled", true);
	} else {
		oLoc.set("value", "", false);
		oLoc.set("disabled", false);
	}

	oCPo.set("value", 0);
}

function fCPFinderValCPXAltura(vCal, vNum, vCPo) {
	var vRet = false;

	if (!isNaN(vNum) && !isNaN(vCPo)) {
		// Validar CP por Altura
		require([ "dojo/request", "dojo/domReady!" ], function(request) {
			var vURL = fGetURLSvc("CPFinderService/getValCPXAltura?calle="
					+ vCal + "&numero=" + vNum + "&codigoPostal=" + vCPo);
			var deferred = request.get(vURL, {
				handleAs : "json",
				sync : true
			});

			deferred.then(function(response) {
				vRet = response.result;
			});
		});
	}

	return vRet;
}

function fWaitMsgBoxIni(title, arrMsg) {
	// Sacar X
	dojo.style(dijit.byId("dlgWait").closeButtonNode, "display", "none");
	// Deshabilitar boton
	dijit.byId("btnWait").set("disabled", true);
	// Titulo
	dijit.byId("dlgWait").set("title", title);
	// Mensajes
	for (var i = 0; i < 8; i++) {
		if (i < arrMsg.length) {
			document.getElementById("lblWaitP" + i).innerHTML = arrMsg[i];
			document.getElementById("trWaitP" + i).style.display = "";
			document.getElementById("imgWaitP" + i).src = fGetIcon(i == 0 ? "A"
					: "N");
		} else {
			document.getElementById("lblWaitP" + i).innerHTML = "";
			document.getElementById("trWaitP" + i).style.display = "none";
			document.getElementById("imgWaitP" + i).src = fGetIcon("N");
		}
	}
	// Mostrar
	if (!dijit.byId("dlgWait")._isShown()) {
		dijit.byId("dlgWait").show();
	}
}

function fWaitMsgBoxUpd(pos, message, image) {
	// Mensaje
	document.getElementById("lblWaitP" + pos).innerHTML = message;
	// Imagen
	document.getElementById("imgWaitP" + pos).src = fGetIcon(image);
}

function fWaitMsgBoxClose() {
	// Titulo
	dijit.byId("dlgWait").set("title", "Finalizado");
	// Habilitar cierre
	dijit.byId("btnWait").set("disabled", false);
}