function onOBPLoad() {
	// Inicializar
	fOBPInit();
	// Cargar
	fOBPSolLoa(1);
	// ReadOnly
	fOBPSolROn(true);
	fOBPArcROn(true);
	fMnuDeselect();
}

/*
 * function onOBPUnload() { if (document.getElementById("txtOBP_SOL_NRO_SOL")) {
 * if (document.getElementById("txtOBP_SOL_NRO_SOL").producto != "") {
 * fOBPSolSet(2, document.getElementById("txtOBP_SOL_NRO_SOL").producto,
 * document.getElementById("txtOBP_SOL_NRO_SOL").solicitud, 0, 0, ""); }
 * fGridTltDisconnect(); } }
 */

function fOBPInit() {
	// Resize
	fBrowserResize();
	// Ancho de botones
	dojo.style("btnOBPSolTom", "width", "120px");
	dojo.style("btnOBPSolHis", "width", "120px");
	dojo.style("btnOBPSolDej", "width", "100px");
	dojo.style("btnOBPSolEst", "width", "100px");
	dojo.style("btnOBPArcVie", "width", "100px");
	dojo.style("btnOBPArcAdd", "width", "120px");
	dojo.style("btnOBPArcDel", "width", "120px");
	dojo.style("btnOBPArcPDF", "width", "110px");
	dojo.style("btnOBPSolCkl", "width", "95px");
	// Hiddens
	fOBPSolTomHid("");
	// Cargar HTML Includes
	// PDF Manual
	var vInc = fGetURLPag("includes/pdfManual.html");
	var oCPD = dijit.byId("divOBPPDFBox");
	oCPD.set("href", vInc);
}

function fOBPSolROn(value) {
	// Lista
	dijit.byId("btnOBPSolTom").set("disabled", !value);
	dijit.byId("btnOBPSolHis").set("disabled", !value);
	// Datos
	dijit.byId("btnOBPSolDej").set("disabled", value);
	dijit.byId("btnOBPSolEst").set("disabled", value);
	dijit.byId("btnOBPArcAdd").set("disabled", value);
	dijit.byId("btnOBPArcPDF").set("disabled", value);
	dijit.byId("btnOBPSolCkl").set("disabled", value);
	// Paneles
	if (value) {
		document.getElementById("divOBPSol").style.display = "inline";
		document.getElementById("divOBPArc").style.display = "none";
	} else {
		document.getElementById("divOBPSol").style.display = "none";
		document.getElementById("divOBPArc").style.display = "inline";
	}
}

function fOBPSolCle() {
	// Datos
	document.getElementById("txtOBP_SOL_NRO_SOL").innerHTML = "";
	document.getElementById("txtOBP_SOL_NRO_SOL").cntArch = 0;
	document.getElementById("txtOBP_SOL_NRO_SOL").producto = "";
	document.getElementById("txtOBP_SOL_NRO_SOL").solicitud = "";
	document.getElementById("txtOBP_SOL_NRO_SOL").fase = "";
	document.getElementById("txtOBP_SOL_NRO_SOL").tipSol = "";
	fDestroyElement("tltOBP_SOL_NRO_SOL");
	document.getElementById("txtOBP_SOL_FEC_ING").innerHTML = "";
	document.getElementById("txtOBP_SOL_ASE_SOL").innerHTML = "";
	document.getElementById("txtOBP_SOL_ASE_SOL").aseTipDoc = "";
	document.getElementById("txtOBP_SOL_ASE_SOL").aseNroDoc = "";
	document.getElementById("txtOBP_SOL_COT_SUM").innerHTML = "";
	document.getElementById("txtOBP_SOL_COT_PRI").innerHTML = "";
	document.getElementById("txtOBP_SOL_COD_OFI").innerHTML = "";
	fDestroyElement("tltOBP_SOL_COD_OFI");
	document.getElementById("txtOBP_SOL_DES_EST").innerHTML = "";
	document.getElementById("txtOBP_SOL_DES_EST").estado = "";
	fDestroyElement("tltOBP_SOL_DES_EST");
	document.getElementById("txtOBP_SOL_UMA_FEC").innerHTML = "";
	document.getElementById("txtOBP_SOL_UMA_USU").innerHTML = "";
	document.getElementById("txtOBP_SOL_VEN_SOL").innerHTML = "";
	fDestroyElement("tltOBP_SOL_RET_DOC");
	document.getElementById("txtOBP_SOL_RET_DOC").style.display = "none";
	document.getElementById("divOBP_SOL_ADD_FAS").style.display = "none";
	// Tree
	if (dijit.byId("treOBPArc") != null) {
		fDestroyElement("treOBPArc");
		document.getElementById("tdOBPArc").innerHTML = '<div id="_divOBPArc" style="width: 400px; height: 500px;"></div>';
	}
}

function fOBPArcROn(value) {
	// Botones
	dijit.byId("btnOBPArcVie").set("disabled", value);
	dijit.byId("btnOBPArcDel").set("disabled", value);
}

function fOBPArcCle() {
	// Datos
	document.getElementById("txtOBP_ARC_DES_TDO").innerHTML = "";
	fDestroyElement("tltOBP_ARC_DES_TDO");
	document.getElementById("txtOBP_ARC_TIP_ARC").innerHTML = "";
	document.getElementById("txtOBP_ARC_TIP_ARC").archivo = "";
	document.getElementById("txtOBP_ARC_TIP_ARC").indBaja = "";
	document.getElementById("txtOBP_ARC_UIN_FEC").innerHTML = "";
	document.getElementById("txtOBP_ARC_UIN_USU").innerHTML = "";
	document.getElementById("txtOBP_ARC_ARC_DOC").innerHTML = "";
	document.getElementById("txtOBP_ARC_ARC_DA1").innerHTML = "";
	document.getElementById("txtOBP_ARC_ARC_DA2").innerHTML = "";
	document.getElementById("txtOBP_ARC_ARC_DA3").innerHTML = "";
	document.getElementById("txtOBP_ARC_ARC_DA4").innerHTML = "";
	dijit.byId("txtOBP_ARC_OBS_ARC").set("value", "");
}

function fOBPSolLoa(vTMs) {
	// Limpiar
	fGridTltDisconnect();
	// Consulta
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("OperationService/getSolicitudList?cache="
				+ fGetCacheRnd() + "&producto=&solicitud=0");
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			response = fJSONParse(response, vTMs);
			if (!!response) {
				var vJSON = response.REGS;
				// Si da error
				if (vJSON == null) {
					return;
				}
				// Listado
				var vData = {
					items : vJSON.REG
				};
				var jsonDataSource = new ItemFileWriteStore({
					data : vData
				});

				var layout = [ [ {
					name : "Solicitud",
					fields : [ "COD_PRO", "NRO_SOL", "NRO_PRO" ],
					formatter : fDgrColMlT,
					width : "60px"
				}, {
					name : "Fecha de Ingreso",
					field : "FEC_ING",
					width : "105px"
				}, {
					name : "Aseg.Doc.",
					fields : [ "ASE_NDO", "ASE_TDD" ],
					formatter : fDgrColMul,
					width : "80px"
				}, {
					name : "Apellido y nombre",
					fields : [ "ASE_APE", "ASE_NOM" ],
					formatter : fDgrColMul,
					width : "100px"
				}, {
					name : "Estado",
					fields : [ "DES_EST", "DES_OTR" ],
					formatter : fDgrColMlT,
					width : "70px"
				}, {
					name : "Fecha de Estado",
					field : "UMA_FEC",
					width : "105px"
				}, {
					name : "&Uacute;ltimo Usuario",
					fields : [ "UMA_COD", "UMA_APE", "UMA_NOM", "OBS_SOL" ],
					formatter : fDgrColMlT,
					width : "120px"
				}, {
					name : "Oficina",
					field : "COD_OFI",
					width : "40px"
				}, {
					name : "Asesor",
					fields : [ "VEN_COD", "VEN_APE", "VEN_NOM" ],
					formatter : fDgrColMul,
					width : "140px"
				}, {
					name : "Usuario que verific&oacute;",
					fields : [ "UVE_COD", "UVE_APE", "UVE_NOM" ],
					formatter : fDgrColMul,
					width : "120px"
				} ] ];

				if (dijit.byId("dgrOBPSolLis") == null) {
					oGrid = new DataGrid({
						id : "dgrOBPSolLis",
						store : jsonDataSource,
						structure : layout,
						rowSelector : "25px",
						rowCount : 20,
						style : 'width: 945px; height: 370px;',
						selectionMode : "single",
						onMouseOver : function() {
							fGridTltConnect();
						},
						getSortProps : function() {
							var c = this.getCell(this.getSortIndex());
							if (!c) {
								if (this.sortFields) {
									return this.sortFields;
								}
								return null;
							} else {
								var desc = c["sortDesc"];
								var si = !(this.sortInfo > 0);
								if (typeof desc == "undefined") {
									desc = si;
								} else {
									desc = si ? !desc : desc;
								}
								var f;
								if (c.field) {
									f = c.field;
								} else {
									f = c.fields[0];
								}
								return [ {
									attribute : f,
									descending : desc
								} ];
							}
						}
					}, "_divOBPSolLis");

					oGrid.startup();
				} else {
					dijit.byId("dgrOBPSolLis").setStructure(layout);
					dijit.byId("dgrOBPSolLis").setStore(jsonDataSource);
				}
				// Contador
				fOBPSolCnt(response.REGS);
				// Botones y paneles
				fOBPSolCle();
				fOBPArcCle();
				dijit.byId("dgrOBPSolLis").update();
				document.getElementById("hTltExec").value = "S";
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fOBPSolCnt(vJSON) {
	var vCodPro = "";
	var vCntTOT = 0;
	var vCntNUE = 0;
	var vCntENC = 0;
	var vCntVER = 0;
	var vCntDER = 0;
	var vCntPEN = 0;
	var vCntVERRMO = 0;
	var vCntVERRSU = 0;
	var vCntVERVEM = 0;
	var vStrCnt = "<table><tr>";
	// Recorro el resultado
	for (var i = 0; i < FOR_MAX_VAL; i++) {
		if (i == vJSON.REG.length) {
			break;
		}
		// Verificacion
		if (vCodPro == "") {
			// Asignar primer RAMO
			vCodPro = DOMPurify.sanitize(vJSON.REG[i].COD_PRO[0].substr(0, 1));
		} else if (vJSON.REG[i].COD_PRO[0].substr(0, 1) != vCodPro) {
			// Verificar si cambia el RAMO
			vStrCnt += "<td style='vertical-align: top;'>";
			// Titulo
			vStrCnt += "<label style='font-weight: bold; display: inline-block; height: 15px; width: 120px;'>"
					+ "Productos " + vCodPro + "</label>" + "<br/>";
			vCodPro = DOMPurify.sanitize(vJSON.REG[i].COD_PRO[0].substr(0, 1));
			// Generar labels
			if (vCntVER > 0) {
				vStrCnt += "<label style='font-weight: normal; display: inline-block; height: 15px; width: 120px;'>"
						+ "Verificada(s)"
						+ "</label>"
						+ "<label style='font-weight: bold; display: inline-block; height: 15px;'>"
						+ String(vCntVER) + "</label><br/>";
				vCntTOT += vCntVER;
			}
			if (vCntVERVEM > 0) {
				vStrCnt += "<label style='font-weight: normal; display: inline-block; height: 15px; width: 120px;'>"
						+ "Validada EM"
						+ "</label>"
						+ "<label style='font-weight: bold; display: inline-block; height: 15px;'>"
						+ String(vCntVERVEM) + "</label><br/>";
				vCntTOT += vCntVERVEM;
			}
			if (vCntVERRMO > 0) {
				vStrCnt += "<label style='font-weight: normal; display: inline-block; height: 15px; width: 120px;'>"
						+ "Respuesta MO"
						+ "</label>"
						+ "<label style='font-weight: bold; display: inline-block; height: 15px;'>"
						+ String(vCntVERRMO) + "</label><br/>";
				vCntTOT += vCntVERRMO;
			}
			if (vCntVERRSU > 0) {
				vStrCnt += "<label style='font-weight: normal; display: inline-block; height: 15px; width: 120px;'>"
						+ "Respuesta SU"
						+ "</label>"
						+ "<label style='font-weight: bold; display: inline-block; height: 15px;'>"
						+ String(vCntVERRSU) + "</label><br/>";
				vCntTOT += vCntVERRSU;
			}
			if (vCntNUE > 0) {
				vStrCnt += "<label style='font-weight: normal; display: inline-block; height: 15px; width: 120px;'>"
						+ "Nueva(s)"
						+ "</label>"
						+ "<label style='font-weight: bold; display: inline-block; height: 15px;'>"
						+ String(vCntNUE) + "</label><br/>";
				vCntTOT += vCntNUE;
			}
			if (vCntENC > 0) {
				vStrCnt += "<label style='font-weight: normal; display: inline-block; height: 15px; width: 120px;'>"
						+ "En Curso"
						+ "</label>"
						+ "<label style='font-weight: bold; display: inline-block; height: 15px;'>"
						+ String(vCntENC) + "</label><br/>";
				vCntTOT += vCntENC;
			}
			if (vCntDER > 0) {
				vStrCnt += "<label style='font-weight: normal; display: inline-block; height: 15px; width: 120px;'>"
						+ "Derivada(s)"
						+ "</label>"
						+ "<label style='font-weight: bold; display: inline-block; height: 15px;'>"
						+ String(vCntDER) + "</label><br/>";
				vCntTOT += vCntDER;
			}
			if (vCntPEN > 0) {
				vStrCnt += "<label style='font-weight: normal; display: inline-block; height: 15px; width: 120px;'>"
						+ "Pendientes(s)"
						+ "</label>"
						+ "<label style='font-weight: bold; display: inline-block; height: 15px;'>"
						+ String(vCntPEN) + "</label><br/>";
				vCntTOT += vCntPEN;
			}
			if (vCntTOT > 0) {
				vStrCnt += "<label style='font-weight: bold; display: inline-block; height: 15px; width: 120px;'>"
						+ "Total"
						+ "</label>"
						+ "<label style='font-weight: bold; display: inline-block; height: 15px;'>"
						+ String(vCntTOT) + "</label>";
			}
			if (vCntTOT == 0 && vCntNUE == 0 && vCntENC == 0 && vCntVER == 0
					&& vCntDER == 0 && vCntPEN == 0 && vCntVERRMO == 0
					&& vCntVERRSU == 0 && vCntVERVEM == 0) {
				vStrCnt += "<label style='font-weight: bold; display: inline-block; height: 15px; color: red;'>"
						+ "No hay solicitudes pendientes." + "</label>";
			}

			// Blanquear variables
			vCntTOT = 0;
			vCntNUE = 0;
			vCntENC = 0;
			vCntVER = 0;
			vCntDER = 0;
			vCntPEN = 0;
			vCntVERRMO = 0;
			vCntVERRSU = 0;
			vCntVERVEM = 0;
			// Cerrar fila
			vStrCnt += "</td><td width='40'>&nbsp;</td>";
		}
		// Contar
		switch (vJSON.REG[i].COD_EST[0]) {
		case 1:
			vCntNUE++;
			break;
		case 2:
			vCntENC++;
			break;
		case 3:
			if (vJSON.REG[i].DES_EST[0] == "VERIFICADO") {
				vCntVER++;
			} else if (vJSON.REG[i].DES_EST[0] == "RESPUESTA MOFFICE") {
				vCntVERRMO++;
			} else if (vJSON.REG[i].DES_EST[0] == "RESPUESTA SUSCR") {
				vCntVERRSU++;
			} else if (vJSON.REG[i].DES_EST[0] == "VALIDADO EMISION") {
				vCntVERVEM++;
			}

			break;
		case 4:
			vCntDER++;
			break;
		case 5:
			vCntPEN++;
			break;
		default:
			// code block
		}
	}
	// Genero el ultimo RAMO
	vStrCnt += "<td style='vertical-align: top;'>";
	// Titulo
	vStrCnt += "<label style='font-weight: bold; display: inline-block; height: 15px; width: 120px;'>"
			+ "Productos " + vCodPro + "</label>" + "<br/>";
	if (vCntVER > 0) {
		vStrCnt += "<label style='font-weight: normal; display: inline-block; height: 15px; width: 120px;'>"
				+ "Verificada(s)"
				+ "</label>"
				+ "<label style='font-weight: bold; display: inline-block; height: 15px;'>"
				+ String(vCntVER) + "</label><br/>";
		vCntTOT += vCntVER;
	}
	if (vCntVERVEM > 0) {
		vStrCnt += "<label style='font-weight: normal; display: inline-block; height: 15px; width: 120px;'>"
				+ "Validada EM"
				+ "</label>"
				+ "<label style='font-weight: bold; display: inline-block; height: 15px;'>"
				+ String(vCntVERVEM) + "</label><br/>";
		vCntTOT += vCntVERVEM;
	}
	if (vCntVERRMO > 0) {
		vStrCnt += "<label style='font-weight: normal; display: inline-block; height: 15px; width: 120px;'>"
				+ "Respuesta MO"
				+ "</label>"
				+ "<label style='font-weight: bold; display: inline-block; height: 15px;'>"
				+ String(vCntVERRMO) + "</label><br/>";
		vCntTOT += vCntVERRMO;
	}
	if (vCntVERRSU > 0) {
		vStrCnt += "<label style='font-weight: normal; display: inline-block; height: 15px; width: 120px;'>"
				+ "Respuesta SU"
				+ "</label>"
				+ "<label style='font-weight: bold; display: inline-block; height: 15px;'>"
				+ String(vCntVERRSU) + "</label><br/>";
		vCntTOT += vCntVERRSU;
	}
	if (vCntNUE > 0) {
		vStrCnt += "<label style='font-weight: normal; display: inline-block; height: 15px; width: 120px;'>"
				+ "Nueva(s)"
				+ "</label>"
				+ "<label style='font-weight: bold; display: inline-block; height: 15px;'>"
				+ String(vCntNUE) + "</label><br/>";
		vCntTOT += vCntNUE;
	}
	if (vCntENC > 0) {
		vStrCnt += "<label style='font-weight: normal; display: inline-block; height: 15px; width: 120px;'>"
				+ "En Curso"
				+ "</label>"
				+ "<label style='font-weight: bold; display: inline-block; height: 15px;'>"
				+ String(vCntENC) + "</label><br/>";
		vCntTOT += vCntENC;
	}
	if (vCntDER > 0) {
		vStrCnt += "<label style='font-weight: normal; display: inline-block; height: 15px; width: 120px;'>"
				+ "Derivada(s)"
				+ "</label>"
				+ "<label style='font-weight: bold; display: inline-block; height: 15px;'>"
				+ String(vCntDER) + "</label><br/>";
		vCntTOT += vCntDER;
	}
	if (vCntPEN > 0) {
		vStrCnt += "<label style='font-weight: normal; display: inline-block; height: 15px; width: 120px;'>"
				+ "Pendientes(s)"
				+ "</label>"
				+ "<label style='font-weight: bold; display: inline-block; height: 15px;'>"
				+ String(vCntPEN) + "</label><br/>";
		vCntTOT += vCntPEN;
	}
	if (vCntTOT > 0) {
		vStrCnt += "<label style='font-weight: bold; display: inline-block; height: 15px; width: 120px;'>"
				+ "Total"
				+ "</label>"
				+ "<label style='font-weight: bold; display: inline-block; height: 15px;'>"
				+ String(vCntTOT) + "</label>";
	}
	if (vCntTOT == 0 && vCntNUE == 0 && vCntENC == 0 && vCntVER == 0
			&& vCntDER == 0 && vCntPEN == 0 && vCntVERRMO == 0
			&& vCntVERRSU == 0 && vCntVERVEM == 0) {
		vStrCnt += "<label style='font-weight: bold; display: inline-block; height: 15px; color: red;'>"
				+ "No hay solicitudes pendientes." + "</label>";
	}
	vStrCnt += "</tr><table>";
	// Asigno los labels
	document.getElementById("divOBPSolCnt").innerHTML = "<label style='font-weight: bold; display: inline-block; height: 15px;'>"
			+ "Cantidad de Solicitudes" + "</label><br/>" + vStrCnt;
}

function fOBPSolTom() {
	var ssn = fSessionValidate();
	if (ssn.pSft) {
		fOBPSolTomExec(ssn.pSft, ssn.key, ssn.type);
	}
}

function fOBPSolTomExec(vPeopleSoft, vProfileKey, vProfileType) {
	var oGrid = dijit.byId("dgrOBPSolLis");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar una solicitud.", "Advertencia", "W");
		return;
	} else {
		fOBPSolTomVal(oItems[0].COD_PRO[0], oItems[0].NRO_SOL[0], vPeopleSoft);
	}
}

function fOBPSolTomVal(vProducto, vSolicitud, vPeopleSoft) {
	// Si no esta tomada o esta tomada por el mismo usuario
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("OperationService/getSolicitudList?cache="
				+ fGetCacheRnd() + "&producto=" + vProducto + "&solicitud="
				+ vSolicitud);
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(
				function(response) {
					if (response.error) {
						vRet = "ERR";
					} else {
						response = fJSONParse(response, 2);
						if (!response || !response.REGS || !response.REGS.REG) {
							fMsgBox("Se ha producido un error.", "Error", "E");
						} else {
							var vJSON = response.REGS.REG[0];
							if (!fOBPSolTomVEs(vJSON.COD_EST)) {
								// Cambio el estado mientras estaba abierta
								fMsgBox("La solicitud a cambiado al estado "
										+ vJSON.DES_EST
										+ " mientras estaba abierta.<br/>"
										+ "Por favor, vuelva a"
										+ " ingresar a la Bandeja de Salida"
										+ " desde el Men&uacute;.",
										"Advertencia", "W");
							} else if (vJSON.UTO_COD == vPeopleSoft
									|| vJSON.UTO_COD == "") {
								fOBPSolTomHid(vJSON);
								fOBPSolTomDo();
							} else {
								fOBPSolTomHid(vJSON);
								fQstBox("La solicitud est&aacute;"
										+ " tomada por otro usuario:" + "<br/>"
										+ vJSON.UTO_COD + " - " + vJSON.UTO_APE
										+ ", " + vJSON.UTO_NOM + " con fecha "
										+ vJSON.UTO_FEC + "<br/>" + "<br/>"
										+ "Desea tomar la solicitud"
										+ " de todas formas?"
										+ "<br/>El usuario anterior "
										+ "ya no podr&aacute; modificarla.",
										"OBPSTO");
							}
						}
					}
				}, function(err) {
					fMsgBox("Se ha producido un error.", "Error", "E");
				});
	});
}

function fOBPSolTomHid(vJSON) {
	try {
		document.getElementById("hOBPSolTom").JSON_SOL = JSON.stringify(vJSON);
	} catch (err) {
		// Error
		fMsgBox("Error de parseo (1).", "Error", "E");
		return;
	}
}

function fOBPSolTomVEs(vEstado) {
	// Seleccionar Item
	var oGrid = dijit.byId("dgrOBPSolLis");
	var oItems = oGrid.selection.getSelected();
	if (oItems[0].COD_EST[0] != vEstado) {
		return false;
	} else {
		return true;
	}
}

function fOBPSolTomDo() {
	// Obtener Solicitud
	var vJSON_SOL;
	try {
		vJSON_SOL = JSON.parse(document.getElementById("hOBPSolTom").JSON_SOL);
	} catch (err) {
		// Error
		fMsgBox("Error de parseo (2).", "Error", "E");
		return;
	}
	// Tomar
	if (fOBPSolSet(1, vJSON_SOL.COD_PRO, vJSON_SOL.NRO_SOL, 0, 0, "") != "OK") {
		fMsgBox("Se ha producido un error.", "Error", "E");
		return;
	} else if (vJSON_SOL.COD_EST == 1 || vJSON_SOL.COD_EST == 3
			|| vJSON_SOL.COD_EST == 4) {
		// Si tiene estado (1) Nuevo (3) Verificado (4) Derivado
		// Recarga y refresca para el nuevo estado
		fOBPSolLoa(1);
		document.getElementById("divOBPSol").style.display = "inline";
		dijit.byId("dgrOBPSolLis").update();
		document.getElementById("divOBPSol").style.display = "none";
	}
	// Datos
	require([ "dojo/request", "dijit/Tree", "dojo/data/ItemFileWriteStore",
			"dojo/data/ItemFileReadStore", "dijit/tree/ForestStoreModel",
			"dojo/domReady!" ], function(request, Tree, ItemFileWriteStore,
			ItemFileReadStore, ForestStoreModel) {
		var vURL = fGetURLSvc("OperationService/getArchivoXSolList?cache="
				+ fGetCacheRnd() + "&producto=" + vJSON_SOL.COD_PRO
				+ "&solicitud=" + vJSON_SOL.NRO_SOL + "&archivo=0");
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			response = fJSONParse(response, 1);
			if (!!response) {
				var vJSON = response.REGS;
				// Si da error
				if (vJSON == null) {
					return;
				}
				// Recorrer el resultado
				var vArcTre = fOBPSolTomArc(vJSON);
				// Crear el arbol
				var vStoreVal = new ItemFileReadStore({
					data : {
						identifier : 'id',
						label : 'label',
						items : vArcTre
					}
				});
				var vTreeModel = new ForestStoreModel({
					store : vStoreVal
				});
				fOBPSolCle();
				fOBPSolTomTre(vTreeModel);
				// Botones y paneles
				fOBPSolROn(false);
				// Datos
				fOBPSolTomDat(vJSON_SOL);
				fOBPSolTomRet(vJSON_SOL.NRO_PRO);
				fOBPArcROn(true);
				// Actualizar para Estados (1) o (4)
				fBOPSolTomAct(vJSON_SOL.COD_EST);
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fBOPSolTomAct(vEst) {
	if (vEst == 1 || vEst == 3 || vEst == 4) {
		document.getElementById("txtOBP_SOL_DES_EST").innerHTML = "EN CURSO";
		document.getElementById("txtOBP_SOL_DES_EST").estado = 2;
	}
}

function fOBPSolTomArc(vJSON) {
	var vArcTre = [];
	var vArcGru = [];
	var vArcDoc = [];
	var vGruDoc = 0;
	var vGruDes = "";
	var vTipDoc = 0;
	var vDesDoc = "";

	for (var i = 0; i < FOR_MAX_VAL; i++) {
		if (i == vJSON.REG.length) {
			break;
		}
		if (vGruDoc != vJSON.REG[i].COD_GDO && vGruDoc != 0) {
			// Si cambia el Grupo
			vArcGru.push({
				label : '<b>' + vDesDoc + '</b>',
				id : vGruDoc + "." + vTipDoc,
				tipo : "TDO",
				children : vArcDoc
			});
			vArcTre.push({
				label : '<b>' + vGruDes + '</b>',
				id : vGruDoc,
				tipo : "GDO",
				children : vArcGru
			});
			vArcGru = [];
			vArcDoc = [];
		} else if (vTipDoc != vJSON.REG[i].COD_TDO && vTipDoc != 0) {
			// Si cambia el TDoc
			vArcGru.push({
				label : '<b>' + vDesDoc + '</b>',
				id : vGruDoc + "." + vTipDoc,
				tipo : "TDO",
				children : vArcDoc
			});
			vArcDoc = [];
		}
		// Genero la leyenda variable
		var vLabel = '<font color="red"><b>';
		vLabel += vJSON.REG[i].UIN_FEC + '</b></font>';
		if (vJSON.REG[i].ARC_TDD.length == 0
				&& vJSON.REG[i].ARC_NDO.length == 0) {
			if (vJSON.REG[i].ARC_DA1.length > 0) {
				vLabel += " - " + vJSON.REG[i].ARC_DA1;
			} else if (vJSON.REG[i].ARC_DA2.length > 0) {
				vLabel += " - " + vJSON.REG[i].ARC_DA2;
			} else if (vJSON.REG[i].ARC_DA3.length > 0) {
				vLabel += " - " + vJSON.REG[i].ARC_DA3;
			}
		} else {
			vLabel += " - " + vJSON.REG[i].ARC_TDD + " " + vJSON.REG[i].ARC_NDO;
		}
		// Cargo el Archivo
		var vVal = {
			id : vJSON.REG[i].COD_GDO + "." + vJSON.REG[i].COD_TDO + "." + i,
			label : vLabel,
			tipo : "ARC",
			NRO_ARC : vJSON.REG[i].NRO_ARC,
			COD_TDO : vJSON.REG[i].COD_TDO,
			DES_TDO : vJSON.REG[i].DES_TDO,
			COD_GDO : vJSON.REG[i].COD_GDO,
			DES_GDO : vJSON.REG[i].DES_GDO,
			TIP_ARC : vJSON.REG[i].TIP_ARC,
			UIN_FEC : vJSON.REG[i].UIN_FEC,
			UIN_COD : vJSON.REG[i].UIN_COD,
			UIN_APE : vJSON.REG[i].UIN_APE,
			UIN_NOM : vJSON.REG[i].UIN_NOM,
			IND_BAJ : vJSON.REG[i].IND_BAJ,
			ARC_TDO : vJSON.REG[i].ARC_TDO,
			ARC_TDD : vJSON.REG[i].ARC_TDD,
			ARC_NDO : vJSON.REG[i].ARC_NDO,
			ARC_DA1 : vJSON.REG[i].ARC_DA1,
			ARC_DA2 : vJSON.REG[i].ARC_DA2,
			ARC_DA3 : vJSON.REG[i].ARC_DA3,
			ARC_DA4 : vJSON.REG[i].ARC_DA4,
			OBS_ARC : vJSON.REG[i].OBS_ARC
		};
		vArcDoc.push(vVal);

		vTipDoc = vJSON.REG[i].COD_TDO;
		vDesDoc = vJSON.REG[i].DES_TDO;
		vGruDoc = vJSON.REG[i].COD_GDO;
		vGruDes = vJSON.REG[i].DES_GDO;
	}
	// Agrego el ultimo
	vArcGru.push({
		label : '<b>' + vDesDoc + '</b>',
		id : vGruDoc + "." + vTipDoc,
		tipo : "TDO",
		children : vArcDoc
	});
	vArcTre.push({
		label : '<b>' + vGruDes + '</b>',
		id : vGruDoc,
		tipo : "GDO",
		children : vArcGru
	});
	vArcGru = [];
	vArcDoc = [];
	// Retorno
	return vArcTre;
}

function fOBPSolTomTre(vTreeModel) {
	if (dijit.byId("treOBPArc") == null) {
		oTree = dijit.Tree({
			id : "treOBPArc",
			style : 'width: 400px;height: 500px;',
			model : vTreeModel,
			autoExpand : true,
			showRoot : false,
			_createTreeNode : function(args) {
				var tnode = new dijit._TreeNode(args);
				tnode.labelNode.innerHTML = args.label;
				return tnode;
			},
			onClick : function(item) {
				fOBPArcDat(item);
			},
			onDblClick : function(item) {
				fOBPArcVie();
			},
			getIconClass : function(item, opened) {
				if (item.tipo == undefined) {
					return "dijitIconDelete";
				} else if (item.tipo == "GDO") {
					return "dijitIconFolderOpen";
				} else if (item.tipo == "TDO") {
					return "dijitIconCopy";
				} else if (item.tipo == "ARC") {
					if (item.TIP_ARC == "image/png"
							|| item.TIP_ARC == "image/jpeg") {
						return "dijitIconSample";
					} else if (item.TIP_ARC == "application/pdf") {
						return "dijitIconEdit";
					} else if (item.TIP_ARC == "audio/mp3") {
						return "dijitIconFunction";
					} else {
						return "dijitIconTask";
					}
				} else {
					return "dijitIconDelete";
				}
			}
		}, "_divOBPArc");

		oTree.startup();
	}
}

function fOBPSolTomDat(vJSON) {
	// Cargar Datos
	document.getElementById("txtOBP_SOL_NRO_SOL").innerHTML = DOMPurify
			.sanitize(vJSON.COD_PRO + " " + vJSON.NRO_SOL);
	document.getElementById("txtOBP_SOL_NRO_SOL").producto = vJSON.COD_PRO;
	document.getElementById("txtOBP_SOL_NRO_SOL").solicitud = vJSON.NRO_SOL;
	document.getElementById("txtOBP_SOL_NRO_SOL").fase = vJSON.COD_FAS;
	document.getElementById("txtOBP_SOL_NRO_SOL").tipSol = vJSON.TIP_SOL;
	require([ "dojo/ready", "dijit/Tooltip" ], function(ready, Tooltip) {
		ready(function() {
			new Tooltip({
				id : "tltOBP_SOL_NRO_SOL",
				connectId : [ "txtOBP_SOL_NRO_SOL" ],
				label : "<b>Propuesta: </b>" + vJSON.NRO_PRO
			});
		});
	});
	document.getElementById("txtOBP_SOL_FEC_ING").innerHTML = DOMPurify
			.sanitize(vJSON.FEC_ING);
	document.getElementById("txtOBP_SOL_ASE_SOL").innerHTML = DOMPurify
			.sanitize(vJSON.ASE_TDD + " " + vJSON.ASE_NDO + " " + vJSON.ASE_APE
					+ " " + vJSON.ASE_NOM);
	document.getElementById("txtOBP_SOL_ASE_SOL").aseTipDoc = vJSON.ASE_TDO;
	document.getElementById("txtOBP_SOL_ASE_SOL").aseNroDoc = vJSON.ASE_NDO;
	if (vJSON.COD_PRO.substr(0, 1) == "I") {
		document.getElementById("lblOBP_SOL_COT_PRI").innerHTML = "Prima:";
		document.getElementById("lblOBP_SOL_COT_SUM").innerHTML = "Suma Aseg./Plus:";
		document.getElementById("txtOBP_SOL_COT_SUM").innerHTML = DOMPurify
				.sanitize(vJSON.COT_SUM + " / " + vJSON.COT_PLU);
		document.getElementById("txtOBP_SOL_COT_PRI").innerHTML = DOMPurify
				.sanitize(vJSON.COT_PRI);
	} else if (vJSON.COD_PRO.substr(0, 1) == "R") {
		document.getElementById("lblOBP_SOL_COT_PRI").innerHTML = "Aporte Inicial:";
		document.getElementById("lblOBP_SOL_COT_SUM").innerHTML = "";
		if (vJSON.COT_PLU == "A") {
			document.getElementById("lblOBP_SOL_COT_SUM").innerHTML = "Aporte Peri&oacute;dico:";
		} else if (vJSON.COT_PLU == "F") {
			document.getElementById("lblOBP_SOL_COT_SUM").innerHTML = "Fondo Deseado:";
		} else if (vJSON.COT_PLU == "R") {
			document.getElementById("lblOBP_SOL_COT_SUM").innerHTML = "Renta Deseada:";
		}
		document.getElementById("txtOBP_SOL_COT_SUM").innerHTML = DOMPurify
				.sanitize(vJSON.COT_SUM);
		document.getElementById("txtOBP_SOL_COT_PRI").innerHTML = DOMPurify
				.sanitize(vJSON.COT_PRI);
	} else if (vJSON.COD_PRO.substr(0, 1) == "M") {
		document.getElementById("lblOBP_SOL_COT_PRI").innerHTML = "Precio:";
		document.getElementById("lblOBP_SOL_COT_SUM").innerHTML = "Actividad Excluida:";
		document.getElementById("txtOBP_SOL_COT_PRI").innerHTML = DOMPurify
				.sanitize(vJSON.COT_PRI);
		document.getElementById("txtOBP_SOL_COT_SUM").innerHTML = (vJSON.COT_PLU == "S" ? "SI"
				: "NO");
		if (vJSON.COT_PLU != "S" && vJSON.COD_FAS != 30) {
			document.getElementById("divOBP_SOL_ADD_FAS").style.display = "inline";
		}
	}
	if (vJSON.COD_OFI.length > 10) {
		document.getElementById("txtOBP_SOL_COD_OFI").innerHTML = DOMPurify
				.sanitize(vJSON.COD_OFI.substr(0, 10))
				+ "...";
		require([ "dojo/ready", "dijit/Tooltip" ], function(ready, Tooltip) {
			ready(function() {
				new Tooltip({
					id : "tltOBP_SOL_COD_OFI",
					connectId : [ "txtOBP_SOL_COD_OFI" ],
					label : vJSON.COD_OFI
				});
			});
		});
	} else {
		document.getElementById("txtOBP_SOL_COD_OFI").innerHTML = DOMPurify
				.sanitize(vJSON.COD_OFI);
	}
	document.getElementById("txtOBP_SOL_DES_EST").innerHTML = DOMPurify
			.sanitize(vJSON.DES_EST);
	document.getElementById("txtOBP_SOL_DES_EST").estado = vJSON.COD_EST;
	if (vJSON.DES_OTR != "") {
		require([ "dojo/ready", "dijit/Tooltip" ], function(ready, Tooltip) {
			ready(function() {
				new Tooltip({
					id : "tltOBP_SOL_DES_EST",
					connectId : [ "txtOBP_SOL_DES_EST" ],
					label : "<b>Motivo: </b>" + vJSON.DES_OTR
				});
			});
		});
	}
	document.getElementById("txtOBP_SOL_UMA_FEC").innerHTML = DOMPurify
			.sanitize(vJSON.UMA_FEC);
	document.getElementById("txtOBP_SOL_UMA_USU").innerHTML = DOMPurify
			.sanitize(vJSON.UMA_COD + " " + vJSON.UMA_APE + " " + vJSON.UMA_NOM);
	document.getElementById("txtOBP_SOL_VEN_SOL").innerHTML = DOMPurify
			.sanitize(vJSON.VEN_COD + " " + vJSON.VEN_APE + " " + vJSON.VEN_NOM);
	dijit.byId("txtOBP_SOL_OBS_SOL").set("value", vJSON.OBS_SOL);
	if (vJSON.TIP_SOL == "N") {
		document.getElementById("txtOBP_SOL_TIP_SOL").innerHTML = "ONLINE";
	} else if (vJSON.TIP_SOL == "F") {
		document.getElementById("txtOBP_SOL_TIP_SOL").innerHTML = "OFFLINE";
	} else {
		document.getElementById("txtOBP_SOL_TIP_SOL").innerHTML = "Tipo No Asig.";
	}
}

function fOBPSolTomRet(vPropuesta) {
	// Retenciones/Doc.Pendiente
	require([ "dojo/request", "dojo/domReady!" ], function(request, DataGrid,
			ItemFileWriteStore) {
		var vURL = fGetURLSvc("OperationService/getRetDocPendList?cache="
				+ fGetCacheRnd() + "&propuesta=" + vPropuesta);
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			response = fJSONParse(response, 2);
			if (!!response && !!response.CAMPOS) {
				fOBPSolTomRTl(response.CAMPOS);
			}
		});
	});
}

function fOBPSolTomRTl(vJSON) {
	if (vJSON.CANTDOC > 0 || vJSON.CANTRET > 0) {
		document.getElementById("txtOBP_SOL_RET_DOC").style.display = "inline";
		// Retenciones
		var vArrRet = [];
		for (var i = 0; i < vJSON.CANTRET; i++) {
			if (!fOBPSolTomRTlArr(vArrRet, vJSON.RETS.RET[i].DESCRIP)) {
				vArrRet.push(vJSON.RETS.RET[i].DESCRIP);
			}
		}
		var vStrRet = "<b>Retenciones</b><br/>";
		for (var i = 0; i < vArrRet.length; i++) {
			vStrRet += vArrRet[i] + "<br/>";
		}
		// Doc.Pendiente
		var vArrDoc = [];
		for (var i = 0; i < vJSON.CANTDOC; i++) {
			if (!fOBPSolTomRTlArr(vArrDoc, vJSON.DOCS.DOC[i].DESCRIP)) {
				vArrDoc.push(vJSON.DOCS.DOC[i].DESCRIP);
			}
		}
		var vStrDoc = "<b>Documentaci&oacute;n pendiente</b><br/>";
		if (vArrRet.length > 0) {
			vStrDoc = "<br/>" + vStrDoc;
		}
		for (var i = 0; i < vArrDoc.length; i++) {
			vStrDoc += vArrDoc[i] + "<br/>";
		}
		require([ "dojo/ready", "dijit/Tooltip" ], function(ready, Tooltip) {
			ready(function() {
				new Tooltip({
					id : "tltOBP_SOL_RET_DOC",
					connectId : [ "txtOBP_SOL_RET_DOC" ],
					label : vStrRet + vStrDoc
				});
			});
		});
	}
}

function fOBPSolTomRTlArr(vArr, vVal) {
	for (var i = 0; i < vArr.length; i++) {
		if (vArr[i] == vVal) {
			return true;
		}
	}
	return false;
}

function fOBPSolHis() {
	if (fSessionValidate().pSft) {
		fOBPSolHisExec();
	}
}

function fOBPSolHisExec() {
	var oGrid = dijit.byId("dgrOBPSolLis");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar una solicitud.", "Advertencia", "W");
		return;
	}
	// Datos
	require([ "dojo/request", "dojo/domReady!" ], function(request, DataGrid,
			ItemFileWriteStore) {
		var vURL = fGetURLSvc("OperationService/getSolicitudList?cache="
				+ fGetCacheRnd() + "&producto=" + oItems[0].COD_PRO[0]
				+ "&solicitud=" + oItems[0].NRO_SOL[0]);
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			response = fJSONParse(response, 2);
			if (!!response && !!response.REGS && !!response.REGS.REG) {
				fOBPSolHisDat(response.REGS.REG[0]);
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
	// Lista
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("OperationService/getHisSolicitudList?cache="
				+ fGetCacheRnd() + "&producto=" + oItems[0].COD_PRO[0]
				+ "&solicitud=" + oItems[0].NRO_SOL[0]);
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			response = fJSONParse(response, 2);
			if (!!response) {
				var vJSON = response.REGS;
				// Si da error
				if (vJSON == null) {
					return;
				}
				// Listado
				var vData = {
					items : vJSON.REG
				};
				var jsonDataSource = new ItemFileWriteStore({
					data : vData
				});

				var layout = [ [ {
					name : "Fecha",
					field : "FEC_HIS",
					width : "105px"
				}, {
					name : "Fase Original",
					field : "AND_FAS",
					width : "85px"
				}, {
					name : "Fase",
					field : "DES_FAS",
					width : "85px"
				}, {
					name : "Cambio",
					fields : [ "DES_CAM", "DES_ADI" ],
					formatter : fDgrColMlT,
					width : "115px"
				}, {
					name : "Estado",
					fields : [ "DES_EST", "DES_OTR" ],
					formatter : fDgrColMlT,
					width : "90px"
				}, {
					name : "Usuario",
					fields : [ "UMA_COD", "UMA_APE", "UMA_NOM", "OBS_SOL" ],
					formatter : fDgrColMlT,
					width : "135px"
				} ] ];

				if (dijit.byId("dgrOBPHisLis") == null) {
					oGrid = new DataGrid({
						id : "dgrOBPHisLis",
						store : jsonDataSource,
						structure : layout,
						rowSelector : "25px",
						rowCount : 20,
						style : 'height: 300px;',
						selectionMode : "none",
						onMouseOver : function() {
							fGridTltConnect();
						}
					}, "_divOBPHisLis");

					oGrid.startup();
				} else {
					dijit.byId("dgrOBPHisLis").setStructure(layout);
					dijit.byId("dgrOBPHisLis").setStore(jsonDataSource);
				}
				// Botones y paneles
				dijit.byId("dlgOBPHisBox").show();
				dijit.byId("dgrOBPHisLis").update();
				document.getElementById("hTltExec").value = "S";
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fOBPSolHisDat(vJSON) {
	document.getElementById("txtOBP_HIS_NRO_SOL").innerHTML = DOMPurify
			.sanitize(vJSON.COD_PRO + " " + vJSON.NRO_SOL);
	fDestroyElement("tltOBP_HIS_NRO_SOL");
	require([ "dojo/ready", "dijit/Tooltip" ], function(ready, Tooltip) {
		ready(function() {
			new Tooltip({
				id : "tltOBP_HIS_NRO_SOL",
				connectId : [ "txtOBP_HIS_NRO_SOL" ],
				label : "<b>Propuesta: </b>" + vJSON.NRO_PRO
			});
		});
	});
	document.getElementById("txtOBP_HIS_FEC_ING").innerHTML = DOMPurify
			.sanitize(vJSON.FEC_ING);
	document.getElementById("txtOBP_HIS_ASE_SOL").innerHTML = DOMPurify
			.sanitize(vJSON.ASE_TDD + " " + vJSON.ASE_NDO + " " + vJSON.ASE_APE
					+ " " + vJSON.ASE_NOM);
	document.getElementById("txtOBP_HIS_COD_OFI").innerHTML = DOMPurify
			.sanitize(vJSON.COD_OFI);
	document.getElementById("txtOBP_HIS_VEN_SOL").innerHTML = DOMPurify
			.sanitize(vJSON.VEN_COD + " " + vJSON.VEN_APE + " " + vJSON.VEN_NOM);
}

function fOBPSolSet(vTipoCambio, vProducto, vSolicitud, vEstado, votroCod,
		vObservaciones) {
	vRet = "";
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("OperationService/setSolicitud");
		var vPar = "cache=" + fGetCacheRnd() + "&tipoCambio=" + vTipoCambio
				+ "&producto=" + vProducto + "&solicitud=" + vSolicitud
				+ "&estado=" + vEstado + "&otroCod=" + votroCod
				+ "&observaciones=" + vObservaciones;
		var deferred = request.post(vURL, {
			handleAs : "json",
			data : vPar,
			sync : true
		});
		deferred.then(function(response) {
			if (response.error) {
				vRet = "ERR";
			} else {
				response = fOBPSolSetPar(response);
				if (!response || !response.Code) {
					vRet = "ERR";
				} else {
					if (response.Code != "NO_ERROR") {
						if (response.Code == "SOLV_NOT_AUTHORIZED") {
							vRet = "ERV";
						} else if (response.Code == "USER_NOT_AUTHORIZED") {
							vRet = "ERU";
						} else if (response.Code == "SOLI_NOT_AUTHORIZED") {
							vRet = "ERS";
						} else {
							vRet = "ERR";
						}
					} else {
						vRet = "OK";
					}
				}
			}
		}, function(err) {
			vRet = "ERR";
		});
	});
	while (vRet == "") {
		// Esperar hasta que de un resultado, porque es async
	}
	return vRet;
}

function fOBPSolSetPar(vJSON) {
	try {
		return JSON.parse(vJSON.result);
	} catch (err) {
		return false;
	}
}

function fOBPArcDat(vItem) {
	if (vItem.NRO_ARC != undefined) {
		// Paneles
		fOBPArcCle();
		fOBPArcROn(false);
		// Datos
		document.getElementById("txtOBP_ARC_DES_TDO").innerHTML = DOMPurify
				.sanitize(vItem.DES_TDO[0]);
		require([ "dojo/ready", "dijit/Tooltip" ], function(ready, Tooltip) {
			ready(function() {
				new Tooltip({
					id : "tltOBP_ARC_DES_TDO",
					connectId : [ "txtOBP_ARC_DES_TDO" ],
					label : "<b>Grupo: </b>" + vItem.DES_GDO[0]
				});
			});
		});
		document.getElementById("txtOBP_ARC_TIP_ARC").innerHTML = DOMPurify
				.sanitize(vItem.TIP_ARC[0]);
		document.getElementById("txtOBP_ARC_TIP_ARC").archivo = vItem.NRO_ARC[0];
		document.getElementById("txtOBP_ARC_TIP_ARC").indBaja = vItem.IND_BAJ[0];
		document.getElementById("txtOBP_ARC_TIP_ARC").indBaja = vItem.IND_BAJ[0];
		document.getElementById("txtOBP_ARC_UIN_FEC").innerHTML = DOMPurify
				.sanitize(vItem.UIN_FEC[0]);
		document.getElementById("txtOBP_ARC_UIN_USU").innerHTML = DOMPurify
				.sanitize(vItem.UIN_COD[0] + " " + vItem.UIN_APE[0] + " "
						+ vItem.UIN_NOM[0]);
		document.getElementById("txtOBP_ARC_ARC_DOC").innerHTML = DOMPurify
				.sanitize(vItem.ARC_TDD[0] + " " + vItem.ARC_NDO[0]);
		document.getElementById("txtOBP_ARC_ARC_DA1").innerHTML = DOMPurify
				.sanitize(vItem.ARC_DA1[0]);
		document.getElementById("txtOBP_ARC_ARC_DA2").innerHTML = DOMPurify
				.sanitize(vItem.ARC_DA2[0]);
		document.getElementById("txtOBP_ARC_ARC_DA3").innerHTML = DOMPurify
				.sanitize(vItem.ARC_DA3[0]);
		document.getElementById("txtOBP_ARC_ARC_DA4").innerHTML = DOMPurify
				.sanitize(vItem.ARC_DA4[0]);
		dijit.byId("txtOBP_ARC_OBS_ARC").set("value", vItem.OBS_ARC[0]);
	} else {
		fOBPArcROn(true);
		fOBPArcCle();
	}
}

function fOBPArcVie() {
	if (fSessionValidate().pSft) {
		fOBPArcVieExec();
	}
}

function fOBPArcVieExec() {
	// Visualizacion
	if (!dijit.byId("btnOBPArcVie").get("disabled")) {
		if (document.getElementById("txtOBP_ARC_TIP_ARC").indBaja == "0") {
			document.getElementById("txtOBP_SOL_NRO_SOL").cntArch++;
			var vNRO_ARC = document.getElementById("txtOBP_ARC_TIP_ARC").archivo;
			var vTIP_ARC = document.getElementById("txtOBP_ARC_TIP_ARC").innerHTML;
			var vCNT_ARC = document.getElementById("txtOBP_SOL_NRO_SOL").cntArch;
			if (vCNT_ARC > 10) {
				document.getElementById("txtOBP_SOL_NRO_SOL").cntArch = 0;
			}
			window.open(fGetURLMVC("downloadSvc.html?" + "cache="
					+ fGetCacheRnd() + "&proceso=SOL" + "&archivo=" + vNRO_ARC
					+ "&tipoArchivo=" + vTIP_ARC), "viewArc" + vNRO_ARC,
					"resizable=yes,height=700,width=900,top="
							+ String(90 + (vCNT_ARC * 10)) + ",left="
							+ String(90 + (vCNT_ARC * 10)));
		} else if (document.getElementById("txtOBP_ARC_TIP_ARC").indBaja == "2") {
			fMsgBox("El archivo fue depurado en proceso autom&aacute;tico.",
					"Advertencia", "W");
		} else if (document.getElementById("txtOBP_ARC_TIP_ARC").indBaja == "3") {
			fMsgBox("El archivo fue enviado a FileNet.", "Advertencia", "W");
		} else {
			fMsgBox("Se produjo un error al leer el archivo.", "Error", "E");
		}
	}
}

function fOBPSolDej() {
	if (fSessionValidate().pSft) {
		fOBPSolDejExec();
	}
}

function fOBPSolDejExec() {
	fOBPSolSet(2, document.getElementById("txtOBP_SOL_NRO_SOL").producto,
			document.getElementById("txtOBP_SOL_NRO_SOL").solicitud, 0, 0, "");
	// ReadOnly
	fOBPSolROn(true);
	fOBPSolCle();
	fOBPArcROn(true);
	fOBPArcCle();
}

function fOBPSolEst() {
	if (fSessionValidate().pSft) {
		fOBPSolEstExec();
	}
}

function fOBPSolEstExec() {
	fOBPSolEstCbo();
	document.getElementById("hOBPEstFnc").value = "EST";
	document.getElementById("ttrOBPEstCod").style.display = "";
	document.getElementById("ttrOBPEstOtr").style.display = "none";
	document.getElementById("ttrOBPEstObs").style.display = "";
	document.getElementById("lblOBP_EST_OTR").innerHTML = "Otro:";
	dijit.byId("txtOBP_EST_OBS").set("value", "");
	dijit.byId("dlgOBPEstBox").set("title", "Cambiar estado");
	dijit.byId("dlgOBPEstBox").show();
}

function fOBPSolEstCbo() {
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("ParametersService/getEstadoList?cache="
				+ fGetCacheRnd() + "&estadoActual="
				+ document.getElementById("txtOBP_SOL_DES_EST").estado);
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			if (!response.error) {
				response = fJSONParse(response, 2);
				if (!!response) {
					fComboClean("cboOBP_EST_COD");
					var oCbo = dijit.byId("cboOBP_EST_COD");
					var vJSON = response;
					// Cargar uno en todos
					var oOpt = {};
					oOpt.label = "...";
					oOpt.value = "0";
					oOpt.selected = true;
					oCbo.addOption(oOpt);
					// Cargar combo
					for ( var i in vJSON.REGS.REG) {
						oOpt = {};
						oOpt.label = vJSON.REGS.REG[i].DES_EST;
						oOpt.value = String(vJSON.REGS.REG[i].COD_EST) + "|"
								+ String(vJSON.REGS.REG[i].OTR_EST);
						oOpt.selected = false;
						oCbo.addOption(oOpt);
					}
				}
			}
		});
	});
}

function fOBPSolEstOtr() {
	// Limpiar
	document.getElementById("ttrOBPEstOtr").style.display = "none";
	document.getElementById("lblOBP_EST_OTR").innerHTML = "Otro:";
	dijit.byId("txtOBP_EST_OBS").set("value", "");
	fComboClean("cboOBP_EST_OTR");
	// Obtener estado
	var vEst = dijit.byId("cboOBP_EST_COD").get("value");
	if (vEst == "" || vEst == "0") {
		return;
	}
	// Obtener la funcion del segundo combo
	var vOtr = vEst.split("|")[1];
	vEst = vEst.split("|")[0];
	if (vOtr == "") {
		return;
	}
	// Si tiene segunda funcion
	var vSvc = "";
	var vPar = "";
	var vCpoCod = "";
	var vCpoLab = "";
	if (vOtr == "CBO_FAS") {
		document.getElementById("ttrOBPEstOtr").style.display = "";
		document.getElementById("lblOBP_EST_OTR").innerHTML = "Fase:";
		vSvc = "getFaseList";
		vPar = "&perfil=&producto="
				+ document.getElementById("txtOBP_SOL_NRO_SOL").producto;
		vCpoCod = "COD_FAS";
		vCpoLab = "DES_FAS";
	} else if (vOtr == "CBO_MOT") {
		document.getElementById("ttrOBPEstOtr").style.display = "";
		document.getElementById("lblOBP_EST_OTR").innerHTML = "Motivo:";
		vSvc = "getPendMotivoList";
		vPar = "";
		vCpoCod = "COD_MOT";
		vCpoLab = "DES_MOT";
	} else {
		return;
	}
	// Obtener segundo combo
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("ParametersService/" + vSvc + "?cache="
				+ fGetCacheRnd() + "&" + vPar);
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			if (!response.error) {
				response = fJSONParse(response, 2);
				if (!!response) {
					fComboAllLoad(response, "cboOBP_EST_OTR", vCpoCod, vCpoLab,
							"...", "0");
				}
			}
		});
	});
}

function fOBPSolEstDo() {
	// Validacion de datos
	var vEst = "0";
	if (dijit.byId("cboOBP_EST_COD").get("value") == ""
			|| dijit.byId("cboOBP_EST_COD").get("value") == "0") {
		fMsgBox("Debe seleccionar un estado.", "Validaci&oacute;n", "W");
		return;
	} else {
		vEst = dijit.byId("cboOBP_EST_COD").get("value").split("|")[0];
	}
	var vOtr = "0";
	if (document.getElementById("ttrOBPEstOtr").style.display == "") {
		if (dijit.byId("cboOBP_EST_OTR").get("value") == ""
				|| dijit.byId("cboOBP_EST_OTR").get("value") == "0") {
			fMsgBox(
					"Debe seleccionar "
							+ document.getElementById("lblOBP_EST_OTR").innerHTML
							+ ".", "Validaci&oacute;n", "W");
			return;
		} else {
			vOtr = dijit.byId("cboOBP_EST_OTR").get("value");
		}
	}
	if (String(dijit.byId("txtOBP_EST_OBS").get("value")).length > 0) {
		if (!fValType("T", dijit.byId("txtOBP_EST_OBS").get("value"))) {
			fMsgBox("Las observaciones tienen caracteres inv&aacute;lidos.",
					"Validaci&oacute;n", "W");
			return;
		}
	} else {
		fMsgBox("Debe ingresar observaciones por el cambio de estado.",
				"Validaci&oacute;n", "W");
		return;
	}
	// Si es para Anulacion
	if (vEst == "6") {
		fQstBox("Est&aacute; seguro que desea anular la solicitud?" + "<br/>"
				+ "Esta operaci&oacute;n no podr&aacute; deshacerse.",
				"OBPSES", vEst, vOtr);
	} else {
		fOBPSolEstYes(vEst, vOtr);
	}
}

function fOBPSolEstYes(vEst, vOtr) {
	// Cambiar estado
	var vRet = fOBPSolSet(5,
			document.getElementById("txtOBP_SOL_NRO_SOL").producto, document
					.getElementById("txtOBP_SOL_NRO_SOL").solicitud, vEst,
			vOtr, fEncodeURI(dijit.byId("txtOBP_EST_OBS").get("value")));
	if (vRet != "OK") {
		if (vRet == "ERV") {
			fMsgBox("No es posible derivar la solicitud a esa fase.", "Error",
					"E");
			return;
		} else if (vRet == "ERU") {
			fMsgBox("Usuario no autorizado para realizar la operaci&oacute;n.",
					"Error", "E");
			return;
		} else if (vRet == "ERS") {
			fMsgBox(
					"Usuario no autorizado para realizar la operaci&oacute;n<br/>"
							+ "sobre esta solicitud.", "Error", "E");
			return;
		} else {
			fMsgBox("Se ha producido un error.", "Error", "E");
			return;
		}
	} else {
		dijit.byId('dlgOBPEstBox').onCancel();
		fMsgBox("Cambio de estado exitoso!", "Exito", "O");
		// Recargar
		fOBPSolLoa(1);
		// ReadOnly
		fOBPSolROn(true);
		fOBPArcROn(true);
		// Updatear Grilla
		dijit.byId("dgrOBPSolLis").update();
	}
}

function fOBPArcAdd() {
	if (fSessionValidate().pSft) {
		fOBPArcAddExec();
	}
}

function fOBPArcAddExec() {
	// Validar
	if (document.getElementById("txtOBP_SOL_DES_EST").estado == "5") {
		fMsgBox(
				"No puede realizar esta operaci&oacute;n en"
						+ "<br/>"
						+ "una solicitud en estado "
						+ document.getElementById("txtOBP_SOL_DES_EST").innerHTML
						+ ".", "Validaci&oacute;n", "W");
		return;
	}
	// Limpiar y cargar
	document.frmOBPUpload.reset();
	fOBPArcAddCbo();
	dijit.byId("cboOBP_AGR_TAR").set("value", "");
	dijit.byId("txtOBP_AGR_DND").set("value", "");
	dijit.byId("txtOBP_AGR_DA1").set("value", "");
	dijit.byId("txtOBP_AGR_DA2").set("value", "");
	dijit.byId("txtOBP_AGR_DA3").set("value", "");
	dijit.byId("txtOBP_AGR_DA4").set("value", "");
	dijit.byId("txtOBP_AGR_OBS").set("value", "");
	dijit.byId("dlgOBPUplBox").show();
}

function fOBPArcAddCbo() {
	// Cargar Combo Grupos Documentales
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("ParametersService/getGrupoDocumentalList?cache="
				+ fGetCacheRnd());
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			if (!response.error) {
				response = fJSONParse(response, 2);
				if (!!response) {
					fComboClean("cboOBP_AGR_TDO");
					fComboClean("cboOBP_AGR_GDO");
					fComboAllLoad(response, "cboOBP_AGR_GDO", "COD_GDO",
							"DES_GDO", "...", "0");
				}
			}
		});
	});
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("ParametersService/getTipoDocumentoList?cache="
				+ fGetCacheRnd());
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			if (!response.error) {
				response = fJSONParse(response, 2);
				if (!!response) {
					fComboClean("cboOBP_AGR_DTD");
					var oCbo = dijit.byId("cboOBP_AGR_DTD");
					var vJSON = response;
					// Cargar uno en todos
					var oOpt = {};
					oOpt.label = "...";
					oOpt.value = "0";
					oOpt.selected = true;
					oCbo.addOption(oOpt);
					// Cargar combo
					for ( var i in vJSON.TIPOS.TIPO) {
						oOpt = {};
						oOpt.label = vJSON.TIPOS.TIPO[i].POV_DES_TDO;
						oOpt.value = String(vJSON.TIPOS.TIPO[i].POV_COD_TDO);
						oOpt.selected = false;
						oCbo.addOption(oOpt);
					}
				}
			}
		});
	});
}

function fOBPArcAddTDo() {
	// Cargar Combo Tipos Documentales
	if (dijit.byId("cboOBP_AGR_GDO").get("value") != "0"
			&& dijit.byId("cboOBP_AGR_GDO").get("value") != "") {
		require(
				[ "dojo/request", "dojo/domReady!" ],
				function(request) {
					var vURL = fGetURLSvc("ParametersService/getTipoDocumentalList?cache="
							+ fGetCacheRnd()
							+ "&tipoDoc=0&grupoDoc="
							+ dijit.byId("cboOBP_AGR_GDO").get("value")
							+ "&indBaja=false");
					var deferred = request.get(vURL, {
						handleAs : "json",
						sync : true
					});
					deferred.then(function(response) {
						if (!response.error) {
							response = fJSONParse(response, 2);
							if (!!response) {
								fComboClean("cboOBP_AGR_TDO");
								fComboAllLoad(response, "cboOBP_AGR_TDO",
										"COD_TDO", "DES_TDO", "...", "0");
							}
						}
					});
				});
	} else {
		fComboClean("cboOBP_AGR_TDO");
	}
}

function fOBPArcUpl() {
	if (fSessionValidate().pSft) {
		fOBPArcUplExec();
	}
}

function fOBPArcUplExec() {
	// Validacion de datos
	if (dijit.byId("cboOBP_AGR_TDO").get("value") == "0"
			|| dijit.byId("cboOBP_AGR_TDO").get("value") == "") {
		fMsgBox("Debe seleccionar el tipo documental.", "Validaci&oacute;n",
				"W");
		return;
	}
	if (dijit.byId("cboOBP_AGR_TAR").get("value") == "") {
		fMsgBox("Debe seleccionar el tipo de archivo.", "Validaci&oacute;n",
				"W");
		return;
	}
	if (document.getElementById("txtOBPUplFil").value != "") {
		var vExt = document.getElementById("txtOBPUplFil").value.substr(
				document.getElementById("txtOBPUplFil").value.length - 4)
				.toUpperCase();
		var vTAr = dijit.byId("cboOBP_AGR_TAR").get("value");
		if (vTAr == "image/png" && vExt != ".PNG") {
			fMsgBox("El archivo seleccionado debe ser un PNG.",
					"Validaci&oacute;n", "W");
			return;
		} else if (vTAr == "image/jpeg" && (vExt != ".JPG" && vExt != "JPEG")) {
			fMsgBox("El archivo seleccionado debe ser un JPG.",
					"Validaci&oacute;n", "W");
			return;
		} else if (vTAr == "application/pdf" && vExt != ".PDF") {
			fMsgBox("El archivo seleccionado debe ser un PDF.",
					"Validaci&oacute;n", "W");
			return;
		}
		// No se puede validar el tamano aca, se hace desde el server
		// if (document.getElementById("txtOBPUplFil").size > 2097152) {
		// fMsgBox(
		// "El archivo seleccionado debe tener un tama&ntilde;o inferior a
		// 2Mb.",
		// "Validaci&oacute;n", "W");
		// return;
		// }
	} else {
		fMsgBox("Debe seleccionar el archivo para agregar.",
				"Validaci&oacute;n", "W");
		return;
	}
	if (String(dijit.byId("txtOBP_AGR_DND").get("value")).length > 0) {
		if (isNaN(dijit.byId("txtOBP_AGR_DND").get("value"))) {
			fMsgBox(
					"Debe ingresar un valor num&eacute;rico en el n&uacute;mero de documento.",
					"Validaci&oacute;n", "W");
			return;
		}
		if (dijit.byId("cboOBP_AGR_DTD").get("value") == "0") {
			fMsgBox(
					"Debe seleccionar el tipo de documento si ingresa un n&uacute;mero.",
					"Validaci&oacute;n", "W");
			return;
		}
	} else {
		if (dijit.byId("cboOBP_AGR_DTD").get("value") != "0") {
			fMsgBox(
					"Debe ingresar el n&uacute;mero de documento si selecciona un tipo.",
					"Validaci&oacute;n", "W");
			return;
		}
	}
	if (!fValType("T", dijit.byId("txtOBP_AGR_DA1").get("value"))) {
		fMsgBox("El DATO1 tienen caracteres inv&aacute;lidos.",
				"Validaci&oacute;n", "W");
		return;
	}
	if (!fValType("T", dijit.byId("txtOBP_AGR_DA2").get("value"))) {
		fMsgBox("El DATO2 tienen caracteres inv&aacute;lidos.",
				"Validaci&oacute;n", "W");
		return;
	}
	if (!fValType("T", dijit.byId("txtOBP_AGR_DA3").get("value"))) {
		fMsgBox("El DATO3 tienen caracteres inv&aacute;lidos.",
				"Validaci&oacute;n", "W");
		return;
	}
	if (!fValType("T", dijit.byId("txtOBP_AGR_DA4").get("value"))) {
		fMsgBox("El DATO4 tienen caracteres inv&aacute;lidos.",
				"Validaci&oacute;n", "W");
		return;
	}
	if (!fValType("T", dijit.byId("txtOBP_AGR_OBS").get("value"))) {
		fMsgBox("Las observaciones tienen caracteres inv&aacute;lidos.",
				"Validaci&oacute;n", "W");
		return;
	}
	// Agregar
	document.getElementById("hOBPUplHab").value = "S";
	document.frmOBPUpload.action = fGetURLMVC("publishSvc.html?" + "cache="
			+ fGetCacheRnd() + "&proceso=SOL" + "&producto="
			+ document.getElementById("txtOBP_SOL_NRO_SOL").producto
			+ "&solicitud="
			+ document.getElementById("txtOBP_SOL_NRO_SOL").solicitud
			+ "&tipoDoc=" + dijit.byId("cboOBP_AGR_TDO").get("value")
			+ "&tipoArchivo=" + dijit.byId("cboOBP_AGR_TAR").get("value")
			+ "&arcTDoc=" + dijit.byId("cboOBP_AGR_DTD").get("value")
			+ "&arcNDoc=" + dijit.byId("txtOBP_AGR_DND").get("value")
			+ "&arcDato1="
			+ fEncodeURI(dijit.byId("txtOBP_AGR_DA1").get("value"))
			+ "&arcDato2="
			+ fEncodeURI(dijit.byId("txtOBP_AGR_DA2").get("value"))
			+ "&arcDato3="
			+ fEncodeURI(dijit.byId("txtOBP_AGR_DA3").get("value"))
			+ "&arcDato4="
			+ fEncodeURI(dijit.byId("txtOBP_AGR_DA4").get("value"))
			+ "&arcObserv="
			+ fEncodeURI(dijit.byId("txtOBP_AGR_OBS").get("value")));
	document.frmOBPUpload.submit();
}

function fOBPArcUplRet() {
	if (document.getElementById("hOBPUplHab").value == "S") {
		var vIfr = document.getElementById("ifrOBPUpload");
		var vCnt = (vIfr.contentWindow || vIfr.contentDocument);
		if (vCnt.document) {
			vCnt = vCnt.document;
		}
		try {
			var vRes = JSON.parse(vCnt.body.innerHTML);
			if (!vRes.Code) {
				fMsgBox("Se ha producido un error.", "Error", "E");
			} else {
				// Si da error
				if (vRes.Code != "NO_ERROR") {
					if (vRes.Code == "USER_NOT_AUTHORIZED") {
						fMsgBox("El usuario no est&aacute; autorizado"
								+ "<br/>"
								+ "para realizar la operaci&oacute;n.",
								"Error", "E");
					} else if (vRes.Code == "SOLI_NOT_AUTHORIZED") {
						fMsgBox(
								"El usuario no est&aacute; autorizado para "
										+ "<br/>"
										+ "realizar la operaci&oacute;n sobre esta solicitud.",
								"Error", "E");
					} else {
						fMsgBox("Se ha producido un error. " + vRes.Code,
								"Error", "E");
					}
				} else {
					dijit.byId("dlgOBPUplBox").onCancel();
					fMsgBox("Archivo agregado con &eacute;xito!", "Exito", "O");
					fOBPSolTomDo();
				}
			}
		} catch (err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		}
		document.getElementById("hOBPUplHab").value = "N";
	}
}

function fOBPArcDel() {
	if (fSessionValidate().pSft) {
		fOBPArcDelExec();
	}
}

function fOBPArcDelExec() {
	// Validar
	if (document.getElementById("txtOBP_SOL_DES_EST").estado == "5") {
		fMsgBox(
				"No puede realizar esta operaci&oacute;n en"
						+ "<br/>"
						+ "una solicitud en estado "
						+ document.getElementById("txtOBP_SOL_DES_EST").innerHTML
						+ ".", "Validaci&oacute;n", "W");
		return;
	}
	// Cargar
	document.getElementById("hOBPEstFnc").value = "ADE";
	document.getElementById("ttrOBPEstCod").style.display = "none";
	document.getElementById("ttrOBPEstOtr").style.display = "none";
	document.getElementById("ttrOBPEstObs").style.display = "";
	dijit.byId("txtOBP_EST_OBS").set("value", "");
	dijit.byId("dlgOBPEstBox").set("title", "Eliminar archivo");
	dijit.byId("dlgOBPEstBox").show();
}

function fOBPArcDelDo() {
	// Validacion de datos
	if (String(dijit.byId("txtOBP_EST_OBS").get("value")).length > 0) {
		if (!fValType("T", dijit.byId("txtOBP_EST_OBS").get("value"))) {
			fMsgBox("Las observaciones tienen caracteres inv&aacute;lidos.",
					"Validaci&oacute;n", "W");
			return;
		}
	} else {
		fMsgBox("Debe ingresar observaciones por la eliminaci&oacute;n.",
				"Validaci&oacute;n", "W");
		return;
	}
	// Eliminar
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("OperationService/delArchivoXSol");
		var vPar = "cache=" + fGetCacheRnd() + "&producto="
				+ document.getElementById("txtOBP_SOL_NRO_SOL").producto
				+ "&solicitud="
				+ document.getElementById("txtOBP_SOL_NRO_SOL").solicitud
				+ "&archivo="
				+ document.getElementById("txtOBP_ARC_TIP_ARC").archivo
				+ "&observaciones="
				+ fEncodeURI(dijit.byId("txtOBP_EST_OBS").get("value"));
		var deferred = request.post(vURL, {
			handleAs : "json",
			data : vPar,
			sync : true
		});
		deferred.then(function(response) {
			if (!response.error) {
				var vRes = JSON.parse(response.result);
				if (!vRes.Code) {
					fMsgBox("Se ha producido un error.", "Error", "E");
				} else {
					if (vRes.Code == "NO_ERROR") {
						dijit.byId('dlgOBPEstBox').onCancel();
						fMsgBox("Archivo eliminado con &eacute;xito!", "Exito",
								"O");
						fOBPArcCle();
						fOBPSolTomDo();
					} else if (vRes.Code == "USER_NOT_AUTHORIZED") {
						fMsgBox("El usuario no est&aacute; autorizado"
								+ "<br/>"
								+ "para realizar la operaci&oacute;n.",
								"Error", "E");
					} else if (vRes.Code == "SOLI_NOT_AUTHORIZED") {
						fMsgBox("El usuario no est&aacute; autorizado para "
								+ "<br/>" + "realizar la operaci&oacute;n"
								+ " sobre esta solicitud.", "Error", "E");
					} else if (vRes.Code == "TDOC_NOT_AUTHORIZED") {
						fMsgBox("Este tipo documental no permite ser borrado.",
								"Error", "E");
					} else {
						fMsgBox("Se ha producido un error. " + vRes.Code,
								"Error", "E");
					}
				}
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fOBPEstAce() {
	switch (document.getElementById("hOBPEstFnc").value) {
	case "ADE":
		fOBPArcDelDo();
		break;
	case "EST":
		fOBPSolEstDo();
		break;
	default:
		// code block
	}
}

function fOBPArcPDF() {
	if (fSessionValidate().pSft) {
		fOBPArcPDFExec();
	}
}

function fOBPArcPDFExec() {
	dijit.byId("dlgOBPPDFBox").show();
}

function fOBPSolCkl() {
	if (fSessionValidate().pSft) {
		fOBPSolCklExec();
	}
}

function fOBPSolCklExec() {
	// Checkear Checklist
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("OperationService/getSolicitCklList?cache="
				+ fGetCacheRnd() + "&producto="
				+ document.getElementById("txtOBP_SOL_NRO_SOL").producto
				+ "&solicitud="
				+ document.getElementById("txtOBP_SOL_NRO_SOL").solicitud);
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			if (response.error) {
				vRet = false;
			} else {
				response = fJSONParse(response, 0);
				if (!response) {
					// No hacer nada
				} else {
					var vJSON = response.REGS;
					// Si da error
					if (vJSON == null) {
						return;
					}
					// Mostrar el que corresponda
					fOBPSolCklLst(vJSON);
				}
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fOBPSolCklLst(vJSON) {
	fComboClean("cboOBPCklLst");
	var oCbo = dijit.byId("cboOBPCklLst");
	// Cargar uno blanco
	var oOpt = {};
	oOpt.label = "Seleccionar...";
	oOpt.value = "0";
	oOpt.selected = true;
	oCbo.addOption(oOpt);
	// Recorrer los checklist
	var vSel = "0";
	for (var i = 0; i < FOR_MAX_VAL; i++) {
		if (i == vJSON.REG.length) {
			break;
		}
		if (String(vJSON.REG[i].VER_CKL) != "") {
			var aChkLst = String(vJSON.REG[i].VER_CKL).split("|");
			for (var j = 0; j < FOR_MAX_VAL; j++) {
				if (j == aChkLst.length) {
					break;
				}
				oOpt = {};
				if (vJSON.REG[i].COD_FAS == document
						.getElementById("txtOBP_SOL_NRO_SOL").fase) {
					oOpt.label = vJSON.REG[i].DES_FAS + " - Checklist "
							+ aChkLst[j];
					oOpt.value = vJSON.REG[i].COD_FAS + "|" + (j + 1) + "|"
							+ aChkLst[j] + "|S";
					if (vSel == "0") {
						vSel = oOpt.value;
					}
				} else {
					oOpt.label = vJSON.REG[i].DES_FAS + " - Checklist "
							+ aChkLst[j] + " (RO)";
					oOpt.value = vJSON.REG[i].COD_FAS + "|" + (j + 1) + "|"
							+ aChkLst[j] + "|N";
				}
				oOpt.selected = false;
				oCbo.addOption(oOpt);
			}
		}
	}
	oCbo.set("value", vSel);
	document.getElementById("hOBPCklLst").JSON_SOL = JSON.stringify(vJSON);
	dijit.byId("dlgOBPCklLstBox").show();
}

function fOBPCklLstVer() {
	if (dijit.byId("cboOBPCklLst").get("value") == "0") {
		fMsgBox("Debe seleccionar un Checklist.", "Advertencia", "W");
		return;
	}
	// Ocultar popup
	dijit.byId("dlgOBPCklLstBox").onCancel();
	var aChkLst = dijit.byId("cboOBPCklLst").get("value").split("|");
	document.getElementById("hOBPCklLst").fase = aChkLst[0];
	document.getElementById("hOBPCklLst").orden = aChkLst[1];
	document.getElementById("hOBPCklLst").version = aChkLst[2];
	document.getElementById("hOBPCklLst").habilitado = aChkLst[3];
	fOBPSolCklVie();
}

function fOBPSolCklVie() {
	var oCPD = dijit.byId("divOBPCklBox");
	var vInc = fGetURLPag("includes/checklist_v"
			+ document.getElementById("hOBPCklLst").version + ".html");
	oCPD.set("href", vInc);
	oCPD.set("onDownloadEnd", function() {
		fOBPSolCklLoa();
	});
	dijit.byId("dlgOBPCklBox").set("title",
			dijit.byId("cboOBPCklLst").get("displayedValue"));
	// Tamaño
	var vVer = document.getElementById("hOBPCklLst").version;
	if (vVer == "1" || vVer == "4" || vVer == "5") {
		dijit.byId("divOBPCklBox").set("style", "width: 400px; height: 450px;");
	} else if (vVer == "2" || vVer == "3") {
		dijit.byId("divOBPCklBox").set("style", "width: 585px; height: 450px;");
	}
	dijit.byId("dlgOBPCklBox").show();
}

function fOBPSolCklLoa() {
	var vFas = document.getElementById("hOBPCklLst").fase;
	var vOrd = document.getElementById("hOBPCklLst").orden;
	var vVer = document.getElementById("hOBPCklLst").version;
	var vHab = document.getElementById("hOBPCklLst").habilitado == "S" ? false
			: true;
	// Fix Combos
	fOBPSolCklFix(vVer);
	// Boton Modificar
	dijit.byId("btnOBPCklAdd").set("disabled", vHab);
	// JSON Cheklist
	var vJSON = JSON.parse(document.getElementById("hOBPCklLst").JSON_SOL);
	// Obtener Datos y Formato
	var vDat = "";
	var vFmt = "";
	for (var i = 0; i < vJSON.REG.length; i++) {
		if (vJSON.REG[i].COD_FAS == vFas) {
			vDat = vJSON.REG[i]["DA" + vOrd + "_CKL"];
			vFmt = vJSON.REG[i].FMT_CKL.split("|")[vOrd - 1];
			break;
		}
	}
	var aTam = vFmt.split(",");
	document.getElementById("hOBPCklLst").format = vFmt;
	// Habilitar y Cargar
	var vCtl = "";
	var vDPr = "";
	var vPos = 0;
	var vTam = 0;
	var vTVa = 0;
	var vTAr = [];
	var vTTa = 0;
	for (var j = 0; j < aTam.length; j++) {
		vCtl = "CKL_V" + fFormatFill(vVer, 2, "0", "R") + "_D"
				+ fFormatFill(j, 2, "0", "R");
		if (dijit.byId("cbo" + vCtl)) {
			if (aTam[j].indexOf("-") > -1) {
				vTam = Number(aTam[j].split("-")[0]);
				vTVa = Number(aTam[j].split("-")[1]);
				vTAr = aTam[j].split("-")[2].split("_");
			} else {
				vTam = Number(aTam[j]);
				vTVa = 0;
				vTAr = [];
				vTTa = 0;
			}
			dijit.byId("cbo" + vCtl).set("disabled", vHab);
			vDPr = vDat.substring(vPos, vPos + vTam);
			dijit.byId("cbo" + vCtl).set("value", vDPr, false);
			// Otro Dato
			for (var k = 0; k < vTAr.length; k++) {
				vPos += vTam;
				vTTa = Number(vTAr[k]);
				vDPr = vDat.substring(vPos, vPos + vTTa);
				if (dijit.byId("cbo" + vCtl).get("value") == vTVa) {
					if (!vHab) {
						fOBPSolCklOtr(vCtl, vTVa);
					}
					if (dijit.byId("cbo" + vCtl + "_O0" + k)) {
						dijit.byId("cbo" + vCtl + "_O0" + k).set("value", vDPr);
					} else if (dijit.byId("txt" + vCtl + "_O0" + k)) {
						dijit.byId("txt" + vCtl + "_O0" + k).set("value", vDPr);
					}
				}
				vTam = vTTa;
			}
		} else if (dijit.byId("txt" + vCtl)) {
			vTam = Number(aTam[j]);
			dijit.byId("txt" + vCtl).set("disabled", vHab);
			vDPr = vDat.substring(vPos, vPos + vTam);
			dijit.byId("txt" + vCtl).set("value", vDPr);
		}
		vPos += vTam;
	}
	// Usuario
	document.getElementById("txtCKL_UMA_FEC").innerHTML = DOMPurify
			.sanitize(vJSON.REG[i].UMA_FEC);
	document.getElementById("txtCKL_UMA_USU").innerHTML = DOMPurify
			.sanitize(vJSON.REG[i].UMA_COD + " " + vJSON.REG[i].UMA_APE + " "
					+ vJSON.REG[i].UMA_NOM);
}

function fOBPSolCklFix(vVer) {
	if (vVer == "2") {
		var vPrd = document.getElementById("txtOBP_SOL_NRO_SOL").producto;
		var oCbo = dijit.byId("cboCKL_V02_D00");
		var oOpt = {};
		if (vPrd == "IC09" || vPrd == "IT05" || vPrd == "IT06") {
			fComboClean("cboCKL_V02_D00");
			oOpt = {};
			oOpt.label = "...";
			oOpt.value = "0";
			oOpt.selected = true;
			oCbo.addOption(oOpt);
			oOpt = {};
			oOpt.label = "16 a 40 a&ntilde;os USD 45.000";
			oOpt.value = "1";
			oOpt.selected = false;
			oCbo.addOption(oOpt);
			oOpt = {};
			oOpt.label = "41 a 45 a&ntilde;os USD 40.000";
			oOpt.value = "2";
			oOpt.selected = false;
			oCbo.addOption(oOpt);
			oOpt = {};
			oOpt.label = "46 a 50 a&ntilde;os USD 31.000";
			oOpt.value = "3";
			oOpt.selected = false;
			oCbo.addOption(oOpt);
			oOpt = {};
			oOpt.label = "51 a 64 a&ntilde;os USD 21.000";
			oOpt.value = "4";
			oOpt.selected = false;
			oCbo.addOption(oOpt);
		} else if (vPrd == "IT08") {
			fComboClean("cboCKL_V02_D00");
			oOpt = {};
			oOpt.label = "...";
			oOpt.value = "0";
			oOpt.selected = true;
			oCbo.addOption(oOpt);
			oOpt = {};
			oOpt.label = "16 a 40 a&ntilde;os $ 3.000.000";
			oOpt.value = "1";
			oOpt.selected = false;
			oCbo.addOption(oOpt);
			oOpt = {};
			oOpt.label = "41 a 45 a&ntilde;os $ 3.000.000";
			oOpt.value = "2";
			oOpt.selected = false;
			oCbo.addOption(oOpt);
			oOpt = {};
			oOpt.label = "46 a 50 a&ntilde;os $ 3.000.000";
			oOpt.value = "3";
			oOpt.selected = false;
			oCbo.addOption(oOpt);
			oOpt = {};
			oOpt.label = "51 a 64 a&ntilde;os $ 3.000.000";
			oOpt.value = "4";
			oOpt.selected = false;
			oCbo.addOption(oOpt);
		} else if (vPrd == "IT09") {
			fComboClean("cboCKL_V02_D00");
			oOpt = {};
			oOpt.label = "...";
			oOpt.value = "0";
			oOpt.selected = true;
			oCbo.addOption(oOpt);
			oOpt = {};
			oOpt.label = "16 a 40 a&ntilde;os USD 40.000";
			oOpt.value = "1";
			oOpt.selected = false;
			oCbo.addOption(oOpt);
			oOpt = {};
			oOpt.label = "41 a 45 a&ntilde;os USD 35.000";
			oOpt.value = "2";
			oOpt.selected = false;
			oCbo.addOption(oOpt);
			oOpt = {};
			oOpt.label = "46 a 50 a&ntilde;os USD 31.000";
			oOpt.value = "3";
			oOpt.selected = false;
			oCbo.addOption(oOpt);
			oOpt = {};
			oOpt.label = "51 a 64 a&ntilde;os USD 21.000";
			oOpt.value = "4";
			oOpt.selected = false;
			oCbo.addOption(oOpt);
		}
	}
}

function fOBPCklAdd() {
	if (fSessionValidate().pSft) {
		fOBPCklAddExec();
	}
}

function fOBPCklAddExec() {
	var vFas = document.getElementById("hOBPCklLst").fase;
	var vOrd = document.getElementById("hOBPCklLst").orden;
	var vVer = document.getElementById("hOBPCklLst").version;
	var vFmt = document.getElementById("hOBPCklLst").format;
	var vDat = "";
	var vTam = 0;
	var vTAr = [];
	var vTTa = 0;
	// Armar el area
	var aTam = vFmt.split(",");
	for (var i = 0; i < aTam.length; i++) {
		vCtl = "CKL_V" + fFormatFill(vVer, 2, "0", "R") + "_D"
				+ fFormatFill(i, 2, "0", "R");
		if (dijit.byId("cbo" + vCtl)) {
			if (aTam[i].indexOf("-") > -1) {
				vTam = Number(aTam[i].split("-")[0]);
				vTAr = aTam[i].split("-")[2].split("_");
			} else {
				vTam = Number(aTam[i]);
				vTAr = [];
				vTTa = 0;
			}
			vDat += fFormatFill(dijit.byId("cbo" + vCtl).get("value"), vTam,
					"0", "L");
			// Otro Dato
			for (var k = 0; k < vTAr.length; k++) {
				vTTa = Number(vTAr[k]);
				if (dijit.byId("cbo" + vCtl + "_O0" + k)) {
					vDat += fFormatFill(dijit.byId("cbo" + vCtl + "_O0" + k)
							.get("value"), vTTa, " ", "L");
				} else if (dijit.byId("txt" + vCtl + "_O0" + k)) {
					vDat += fFormatFill(dijit.byId("txt" + vCtl + "_O0" + k)
							.get("value"), vTTa, " ", "L");
				}
			}
		} else if (dijit.byId("txt" + vCtl)) {
			vTam = Number(aTam[i]);
			vDat += fFormatFill(dijit.byId("txt" + vCtl).get("value"), vTam,
					" ", "L");
		}
	}
	// Guardar cambios
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("OperationService/setSolicitCkl");
		var vPar = "cache=" + fGetCacheRnd() + "&producto="
				+ document.getElementById("txtOBP_SOL_NRO_SOL").producto
				+ "&solicitud="
				+ document.getElementById("txtOBP_SOL_NRO_SOL").solicitud
				+ "&fase=" + vFas + "&ordenCkl=" + vOrd + "&datoCkl="
				+ fEncodeURI(vDat);
		var deferred = request.post(vURL, {
			handleAs : "json",
			data : vPar,
			sync : true
		});
		deferred.then(function(response) {
			response = fOBPSolSetPar(response);
			if (!!response && !!response.Code) {
				if (response.Code != "NO_ERROR") {
					if (response.Code == "USER_NOT_AUTHORIZED") {
						fOBPCklAddMsg("ERU");
					} else if (response.Code == "SOLI_NOT_AUTHORIZED") {
						fOBPCklAddMsg("ERS");
					} else {
						fOBPCklAddMsg("ERR");
					}
				} else {
					fOBPCklAddMsg("OK");
					dijit.byId("dlgOBPCklBox").onCancel();
				}
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fOBPCklAddMsg(vMsg) {
	if (vMsg == "OK") {
		fMsgBox("Checklist guardado con &eacute;xito!", "Exito", "O");
	} else if (vMsg == "ERU") {
		fMsgBox("Usuario no autorizado para realizar la operaci&oacute;n.",
				"Error", "E");
	} else if (vMsg == "ERS") {
		fMsgBox("Usuario no autorizado para realizar la operaci&oacute;n<br/>"
				+ "sobre esta solicitud.", "Error", "E");
	} else {
		fMsgBox("Se ha producido un error.", "Error", "E");
	}
}

function fOBPSolCklOtr(vCtl, vVal) {
	var vHab = document.getElementById("hOBPCklLst").habilitado == "S" ? false
			: true;
	if (dijit.byId("cbo" + vCtl).get("value") == vVal && !vHab) {
		for (var i = 0; i < 5; i++) {
			if (dijit.byId("cbo" + vCtl + "_O0" + i)) {
				dijit.byId("cbo" + vCtl + "_O0" + i).set("disabled", false);
			} else if (dijit.byId("txt" + vCtl + "_O0" + i)) {
				dijit.byId("txt" + vCtl + "_O0" + i).set("disabled", false);
			}
		}
	} else {
		for (var i = 0; i < 5; i++) {
			if (dijit.byId("cbo" + vCtl + "_O0" + i)) {
				dijit.byId("cbo" + vCtl + "_O0" + i).set("value", "0");
				dijit.byId("cbo" + vCtl + "_O0" + i).set("disabled", true);
			} else if (dijit.byId("txt" + vCtl + "_O0" + i)) {
				dijit.byId("txt" + vCtl + "_O0" + i).set("value", "");
				dijit.byId("txt" + vCtl + "_O0" + i).set("disabled", true);
			}
		}
	}
}

function fOBPPDFVie() {
	if (fSessionValidate().pSft) {
		fOBPPDFVieExec();
	}
}

function fOBPPDFVieExec() {
	// Visualizacion
	document.frmOBPPDF.hOBPPDFTIP.value = "V";
	document.frmOBPPDF.hOBPPDFXML.value = Base64.encode(fOBPPDFGetXML());
	document.frmOBPPDF.hOBPPDFRID.value = "FR_PDF";
	document.frmOBPPDF.target = "_blank";
	document.frmOBPPDF.action = fGetURLMVC("retrieveSvc.html" + "?cache="
			+ fGetCacheRnd());
	document.frmOBPPDF.submit();
}

function fOBPPDFAdd() {
	if (fSessionValidate().pSft) {
		fOBPPDFAddExec();
	}
}

function fOBPPDFAddExec() {
	fWaitMsgBoxIni("PDF Manual", [ "Generando PDF..." ]);
	// Agregado
	document.getElementById("hOBPPDFHab").value = "S";
	document.frmOBPPDF.hOBPPDFTIP.value = "A";
	document.frmOBPPDF.hOBPPDFXML.value = Base64.encode(fOBPPDFGetXML());
	document.frmOBPPDF.hOBPPDFRID.value = "FR_PDF";
	document.frmOBPPDF.hOBPPDFPRO.value = document
			.getElementById("txtOBP_SOL_NRO_SOL").producto;
	document.frmOBPPDF.hOBPPDFSOL.value = document
			.getElementById("txtOBP_SOL_NRO_SOL").solicitud;
	document.frmOBPPDF.hOBPPDFTDO.value = document
			.getElementById("txtOBP_SOL_ASE_SOL").aseTipDoc;
	document.frmOBPPDF.hOBPPDFNDO.value = document
			.getElementById("txtOBP_SOL_ASE_SOL").aseNroDoc;
	document.frmOBPPDF.target = "ifrOBPPDF";
	document.frmOBPPDF.action = fGetURLMVC("retrieveSvc.html" + "?cache="
			+ fGetCacheRnd());
	document.frmOBPPDF.submit();
}

function fOBPPDFAddRet() {
	if (document.getElementById("hOBPPDFHab").value == "S") {
		var vIfr = document.getElementById("ifrOBPPDF");
		var vCnt = (vIfr.contentWindow || vIfr.contentDocument);
		if (vCnt.document) {
			vCnt = vCnt.document;
		}
		try {
			var vRes = JSON.parse(vCnt.body.innerHTML);
			if (!vRes.Code) {
				fMsgBox("Se ha producido un error.", "Error", "E");
			} else {
				// Si da error
				if (vRes.Code != "NO_ERROR") {
					if (vRes.Code == "USER_NOT_AUTHORIZED") {
						fWaitMsgBoxUpd(0,
								"El usuario no est&aacute; autorizado"
										+ "<br/>"
										+ "para realizar la operaci&oacute;n.",
								"Error", "E");
						fWaitMsgBoxClose();
					} else if (vRes.Code == "SOLI_NOT_AUTHORIZED") {
						fWaitMsgBoxUpd(
								0,
								"El usuario no est&aacute; autorizado para "
										+ "<br/>"
										+ "realizar la operaci&oacute;n sobre esta solicitud.",
								"E");
						fWaitMsgBoxClose();
					} else {
						fWaitMsgBoxUpd(0, "Se ha producido un error.", "E");
						fWaitMsgBoxClose();
					}
				} else {
					dijit.byId("dlgOBPPDFBox").onCancel();
					fWaitMsgBoxUpd(0, "Archivo agregado con &eacute;xito!", "O");
					fWaitMsgBoxClose();
					fOBPSolTomDo();
				}
			}
		} catch (err) {
			fWaitMsgBoxUpd(0, "Se ha producido un error.", "E");
			fWaitMsgBoxClose();
		}
		document.getElementById("hOBPPDFHab").value = "N";
	}
}

function fOBPPDFGetXML() {
	vXML = "";
	vXML += "<DATOS>";
	vXML += "<REQ_MED_SUS>" + dijit.byId("txtOBP_PDF_REQ").get("value")
			+ "</REQ_MED_SUS>";
	for (var i = 1; i <= 9; i++) {
		for (var j = 1; j <= 6; j++) {
			vXML += "<REQ_PDF_E" + i + j + ">"
					+ dijit.byId("txtOBP_PDF_E" + i + j).get("value")
					+ "</REQ_PDF_E" + i + j + ">";
		}
	}
	vXML += "<REQ_EXC_COB>" + dijit.byId("txtOBP_PDF_EXC").get("value")
			+ "</REQ_EXC_COB>";
	vXML += "</DATOS>";
	return vXML;
}

function fOBPSolTip() {
	if (fSessionValidate().pSft) {
		fOBPSolTipExec();
	}
}

function fOBPSolTipExec() {
	dijit.byId("cboOBPTSo").set("value",
			document.getElementById("txtOBP_SOL_NRO_SOL").tipSol);
	dijit.byId("dlgOBPTSoBox").show();
}

function fOBPSolAddFas() {
	if (fSessionValidate().pSft) {
		fOBPSolAddFasExec();
	}
}

function fOBPSolAddFasExec() {
	fQstBox("Est&aacute; seguro de agregar la fase?", "OBPAFA");
}

function fOBPSolAddFasDo() {
	// Agregar Fase
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("OperationService/setSolicitFas");
		var vPar = "cache=" + fGetCacheRnd() + "&producto="
				+ document.getElementById("txtOBP_SOL_NRO_SOL").producto
				+ "&solicitud="
				+ document.getElementById("txtOBP_SOL_NRO_SOL").solicitud
				+ "&fase=30" + "&observaciones=";
		var deferred = request.post(vURL, {
			handleAs : "json",
			data : vPar,
			sync : true
		});
		deferred.then(function(response) {
			response = fOBPSolSetPar(response);
			if (!!response && !!response.Code) {
				if (response.Code != "NO_ERROR") {
					if (response.Code == "USER_NOT_AUTHORIZED") {
						fOBPSolAddFasMsg("ERU");
					} else if (response.Code == "SOLI_NOT_AUTHORIZED") {
						fOBPSolAddFasMsg("ERS");
					} else {
						fOBPSolAddFasMsg("ERR");
					}
				} else {
					fOBPSolAddFasMsg(response.Message.REGS.REG[0].RES_MSG);
				}
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fOBPSolAddFasMsg(vMsg) {
	if (vMsg == "OK") {
		fMsgBox("Se agreg&oacute; la fase exitosamente!", "Exito", "O");
	} else if (vMsg == "01") {
		fMsgBox("Ya existe la fase para esta operaci&oacute;n.", "Error", "E");
	} else if (vMsg == "02") {
		fMsgBox("No se puede agregar la fase para este producto.", "Error", "E");
	} else if (vMsg == "ERU") {
		fMsgBox("Usuario no autorizado para realizar la operaci&oacute;n.",
				"Error", "E");
	} else if (vMsg == "ERS") {
		fMsgBox("Usuario no autorizado para realizar la operaci&oacute;n<br/>"
				+ "sobre esta solicitud.", "Error", "E");
	} else {
		fMsgBox("Se ha producido un error.", "Error", "E");
	}
}

function fOBPTSoAdd() {
	if (fSessionValidate().pSft) {
		fOBPTSoAddExec();
	}
}

function fOBPTSoAddExec() {
	if (dijit.byId("cboOBPTSo").get("value") == "") {
		fMsgBox("Debe seleccionar un tipo de solicitud.", "Validaci&oacute;n",
				"W");
	} else {
		// Guardar cambios
		require([ "dojo/request", "dojo/domReady!" ], function(request) {
			var vURL = fGetURLSvc("OperationService/setSolicitTSo");
			var vPar = "cache=" + fGetCacheRnd() + "&producto="
					+ document.getElementById("txtOBP_SOL_NRO_SOL").producto
					+ "&solicitud="
					+ document.getElementById("txtOBP_SOL_NRO_SOL").solicitud
					+ "&tipSol=" + dijit.byId("cboOBPTSo").get("value");
			var deferred = request.post(vURL, {
				handleAs : "json",
				data : vPar,
				sync : true
			});
			deferred.then(function(response) {
				response = fOBPSolSetPar(response);
				if (!!response && !!response.Code) {
					if (response.Code != "NO_ERROR") {
						if (response.Code == "USER_NOT_AUTHORIZED") {
							fOBPTSoAddMsg("ERU");
						} else if (response.Code == "SOLI_NOT_AUTHORIZED") {
							fOBPTSoAddMsg("ERS");
						} else {
							fOBPTSoAddMsg("ERR");
						}
					} else {
						fOBPTSoAddMsg("OK");
						dijit.byId('dlgOBPTSoBox').onCancel();
					}
				}
			}, function(err) {
				fMsgBox("Se ha producido un error.", "Error", "E");
			});
		});
	}
}

function fOBPTSoAddMsg(vMsg) {
	if (vMsg == "OK") {
		document.getElementById("txtOBP_SOL_NRO_SOL").tipSol = dijit.byId(
				"cboOBPTSo").get("value");
		if (dijit.byId("cboOBPTSo").get("value") == "N") {
			document.getElementById("txtOBP_SOL_TIP_SOL").innerHTML = "ONLINE";
		} else if (dijit.byId("cboOBPTSo").get("value") == "F") {
			document.getElementById("txtOBP_SOL_TIP_SOL").innerHTML = "OFFLINE";
		}
	} else if (vMsg == "ERU") {
		fMsgBox("Usuario no autorizado para realizar la operaci&oacute;n.",
				"Error", "E");
	} else if (vMsg == "ERS") {
		fMsgBox("Usuario no autorizado para realizar la operaci&oacute;n<br/>"
				+ "sobre esta solicitud.", "Error", "E");
	} else {
		fMsgBox("Se ha producido un error.", "Error", "E");
	}
}