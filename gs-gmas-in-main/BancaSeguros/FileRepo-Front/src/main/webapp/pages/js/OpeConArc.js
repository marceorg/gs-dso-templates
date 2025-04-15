function onOCALoad() {
	// Inicializar
	fOCAInit();
	fMnuDeselect();
}

function fOCAInit() {
	// Resize
	fBrowserResize();
	// Ancho de botones
	dojo.style("btnOCAArcCon", "width", "150px");
	dojo.style("btnOCAArcLim", "width", "100px");
	dojo.style("btnOCAArcDet", "width", "120px");
	dojo.style("btnOCAArcVol", "width", "120px");
	dojo.style("btnOCAArcDej", "width", "100px");
	dojo.style("btnOCAArcVie", "width", "100px");
	// FechaHoy
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("ParametersService/getFechaHoy?cache="
				+ fGetCacheRnd());
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			if (!response.error || !!response.result) {
				fOCAParFecHoy(response.result);
			}
		});
	});
	// Grupos Documentales
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
					fComboAllLoad(response, "cboOCA_CON_COD_GDO", "COD_GDO",
							"DES_GDO", "...", "0");
				}
			}
		});
	});
	// TiposDoc
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
					fOCAParTDoCbo(response);
				}
			}
		});
	});
}

function fOCAParFecHoy(vRes) {
	document.getElementById("hidOCAFecHoy").value = vRes;
}

function fOCAParTDoCbo(vRes) {
	fComboClean("cboOCA_CON_ARC_TDO");
	var oCbo = dijit.byId("cboOCA_CON_ARC_TDO");
	var vJSON = vRes;
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

function fOCASolCle() {
	// Datos
	document.getElementById("txtOCA_SOL_NRO_SOL").innerHTML = "";
	document.getElementById("txtOCA_SOL_NRO_SOL").producto = "";
	document.getElementById("txtOCA_SOL_NRO_SOL").solicitud = "";
	fDestroyElement("tltOCA_SOL_NRO_SOL");
	document.getElementById("txtOCA_SOL_FEC_ING").innerHTML = "";
	document.getElementById("txtOCA_SOL_ASE_SOL").innerHTML = "";
	document.getElementById("txtOCA_SOL_COT_SUM").innerHTML = "";
	document.getElementById("txtOCA_SOL_COT_PRI").innerHTML = "";
	document.getElementById("txtOCA_SOL_COD_OFI").innerHTML = "";
	fDestroyElement("tltOCA_SOL_COD_OFI");
	document.getElementById("txtOCA_SOL_DES_EST").innerHTML = "";
	document.getElementById("txtOCA_SOL_DES_EST").estado = "";
	fDestroyElement("tltOCA_SOL_DES_EST");
	document.getElementById("txtOCA_SOL_UMA_FEC").innerHTML = "";
	document.getElementById("txtOCA_SOL_UMA_USU").innerHTML = "";
	document.getElementById("txtOCA_SOL_VEN_SOL").innerHTML = "";
	fDestroyElement("tltOCA_SOL_RET_DOC");
	document.getElementById("txtOCA_SOL_RET_DOC").style.display = "none";
}

function fOCAArcCle() {
	// Datos
	document.getElementById("txtOCA_ARC_DES_TDO").innerHTML = "";
	fDestroyElement("tltOCA_ARC_DES_TDO");
	document.getElementById("txtOCA_ARC_TIP_ARC").innerHTML = "";
	document.getElementById("txtOCA_ARC_TIP_ARC").archivo = "";
	document.getElementById("txtOCA_ARC_TIP_ARC").indBaja = "";
	document.getElementById("txtOCA_ARC_UIN_FEC").innerHTML = "";
	document.getElementById("txtOCA_ARC_UIN_USU").innerHTML = "";
	document.getElementById("txtOCA_ARC_ARC_DOC").innerHTML = "";
	document.getElementById("txtOCA_ARC_ARC_DA1").innerHTML = "";
	document.getElementById("txtOCA_ARC_ARC_DA2").innerHTML = "";
	document.getElementById("txtOCA_ARC_ARC_DA3").innerHTML = "";
	document.getElementById("txtOCA_ARC_ARC_DA4").innerHTML = "";
	dijit.byId("txtOCA_ARC_OBS_ARC").set("value", "");
}

function fOCAConFInChk() {
	if (dijit.byId("chkOCA_CON_FEC_ING").get("checked")) {
		dijit.byId("dtxOCA_CON_FEC_IND").set("disabled", false);
		dijit.byId("dtxOCA_CON_FEC_INH").set("disabled", false);
		dijit.byId("dtxOCA_CON_FEC_IND").set(
				"value",
				fFormatDTB(fDateAdd(
						document.getElementById("hidOCAFecHoy").value, -7)));
		dijit.byId("dtxOCA_CON_FEC_INH").set("value",
				fFormatDTB(document.getElementById("hidOCAFecHoy").value));
	} else {
		dijit.byId("dtxOCA_CON_FEC_IND").set("disabled", true);
		dijit.byId("dtxOCA_CON_FEC_INH").set("disabled", true);
		dijit.byId("dtxOCA_CON_FEC_IND").set("value", null);
		dijit.byId("dtxOCA_CON_FEC_INH").set("value", null);
	}
}

function fOCAArcCon() {
	if (fSessionValidate().pSft) {
		fOCAArcConExec();
	}
}

function fOCAArcConExec() {
	// Validar
	if (!fOCAArcConVal()) {
		return;
	}
	// Limpiar
	fGridTltDisconnect();
	// Consulta
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("OperationService/getArcFiltroList?cache="
				+ fGetCacheRnd() + fOCAArcConPar());
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
				} else if (vJSON.REG.length == 0) {
					fMsgBox("No se encontr&oacute; ning&uacute;n registro.",
							"Advertencia", "W");
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
					fields : [ "COD_PRO", "NRO_SOL" ],
					formatter : fDgrColMul,
					width : "50px"
				}, {
					name : "Tipo Documental",
					field : "DES_TDO",
					width : "300px"
				}, {
					name : "Tipo de Archivo",
					field : "TIP_ARC",
					width : "100px"
				}, {
					name : "Fecha de Ingreso",
					field : "UIN_FEC",
					width : "105px"
				}, {
					name : "Usuario",
					fields : [ "UIN_COD", "UIN_APE", "UIN_NOM", "OBS_ARC" ],
					formatter : fDgrColMlT,
					width : "120px"
				}, {
					name : "Documento",
					fields : [ "ARC_TDD", "ARC_NDO" ],
					formatter : fDgrColMul,
					width : "100px"
				} ] ];

				if (dijit.byId("dgrOCAArcLis") == null) {
					oGrid = new DataGrid({
						id : "dgrOCAArcLis",
						store : jsonDataSource,
						structure : layout,
						rowSelector : "25px",
						rowCount : 20,
						style : 'width: 945px; height: 370px;',
						selectionMode : "single",
						onMouseOver : function() {
							fGridTltConnect();
						}
					}, "_divOCAArcLis");

					oGrid.startup();
				} else {
					dijit.byId("dgrOCAArcLis").setStructure(layout);
					dijit.byId("dgrOCAArcLis").setStore(jsonDataSource);
				}
				// Botones y paneles
				document.getElementById("divOCAFil").style.display = "none";
				document.getElementById("divOCAArc").style.display = "inline";
				fOCASolCle();
				fOCAArcCle();
				dijit.byId("dgrOCAArcLis").update();
				document.getElementById("hTltExec").value = "S";
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fOCAArcConVal() {
	// Tipo Documental
	if (dijit.byId("cboOCA_CON_COD_GDO").get("value") != "0"
			&& (dijit.byId("cboOCA_CON_COD_TDO").get("value") == "0" || dijit
					.byId("cboOCA_CON_COD_TDO").get("value") == "")) {
		fMsgBox("Tipo Documental:<br/>"
				+ "Si seleccion&oacute; un grupo documental<br/>"
				+ "debe seleccionar tambi&eacute;n un tipo documental.",
				"Validaci&oacute;n", "W");
		return false;
	}
	// Nro. Documento
	if (dijit.byId("txtOCA_CON_ARC_NDO").get("value") == undefined) {
		fMsgBox("N&uacute;mero de Documento:<br/>"
				+ "Debe ingresar un valor num&eacute;rico.",
				"Validaci&oacute;n", "W");
		return false;
	}
	// Fecha de Ingreso
	if (dijit.byId("chkOCA_CON_FEC_ING").get("checked")) {
		if (dijit.byId("dtxOCA_CON_FEC_IND").get("value") == null) {
			fMsgBox("Fecha de Ingreso:<br/>" + "Desde inv&aacute;lido.",
					"Validaci&oacute;n", "W");
			return false;
		}
		if (dijit.byId("dtxOCA_CON_FEC_INH").get("value") == null) {
			fMsgBox("Fecha de Ingreso:<br/>" + "Hasta inv&aacute;lido.",
					"Validaci&oacute;n", "W");
			return false;
		}
		// Obtengo las fechas
		var vFInDes = dojo.date.locale.format(dijit.byId("dtxOCA_CON_FEC_IND")
				.get("value"), {
			datePattern : "yyyyMMdd",
			selector : "date"
		});
		var vFInHas = dojo.date.locale.format(dijit.byId("dtxOCA_CON_FEC_INH")
				.get("value"), {
			datePattern : "yyyyMMdd",
			selector : "date"
		});
		// Rango
		if (vFInHas < vFInDes) {
			fMsgBox("Fecha de Ingreso:<br/>"
					+ "Hasta debe ser mayor o igual a Desde.",
					"Validaci&oacute;n", "W");
			return false;
		}
		if (vFInHas > document.getElementById("hidOCAFecHoy").value) {
			fMsgBox("Fecha de Ingreso:<br/>"
					+ "Hasta no debe ser mayor a la fecha actual.",
					"Validaci&oacute;n", "W");
			return false;
		}
		if (fDateAdd(vFInDes, 60) < vFInHas) {
			fMsgBox("Fecha de Ingreso:<br/>"
					+ "El rango no debe superar los 60 d&iacute;as.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	// Dato 1-4
	if (dijit.byId("txtOCA_CON_ARC_DA1").get("value") != "") {
		if (dijit.byId("txtOCA_CON_ARC_DA1").get("value").length < 4) {
			fMsgBox("Dato 1:<br/>" + "Debe ingresar al menos 4 caracteres.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	if (dijit.byId("txtOCA_CON_ARC_DA2").get("value") != "") {
		if (dijit.byId("txtOCA_CON_ARC_DA2").get("value").length < 4) {
			fMsgBox("Dato 2:<br/>" + "Debe ingresar al menos 4 caracteres.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	if (dijit.byId("txtOCA_CON_ARC_DA3").get("value") != "") {
		if (dijit.byId("txtOCA_CON_ARC_DA3").get("value").length < 4) {
			fMsgBox("Dato 3:<br/>" + "Debe ingresar al menos 4 caracteres.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	if (dijit.byId("txtOCA_CON_ARC_DA4").get("value") != "") {
		if (dijit.byId("txtOCA_CON_ARC_DA4").get("value").length < 4) {
			fMsgBox("Dato 4:<br/>" + "Debe ingresar al menos 4 caracteres.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	// Verificar que se selecciono algun filtro
	if ((dijit.byId("cboOCA_CON_COD_TDO").get("value") == "0" || dijit.byId(
			"cboOCA_CON_COD_TDO").get("value") == "")
			&& dijit.byId("cboOCA_CON_TIP_ARC").get("value") == ""
			&& dijit.byId("cboOCA_CON_ARC_TDO").get("value") == "0"
			&& isNaN(dijit.byId("txtOCA_CON_ARC_NDO").get("value"))
			&& dijit.byId("txtOCA_CON_ARC_DA1").get("value") == ""
			&& dijit.byId("txtOCA_CON_ARC_DA2").get("value") == ""
			&& dijit.byId("txtOCA_CON_ARC_DA3").get("value") == ""
			&& dijit.byId("txtOCA_CON_ARC_DA4").get("value") == ""
			&& dijit.byId("chkOCA_CON_FEC_ING").get("checked") == false) {
		fMsgBox("Debe seleccionar al menos un filtro de b&uacute;squeda.",
				"Validaci&oacute;n", "W");
		return false;
	}
	return true;
}

function fOCAArcConPar() {
	var vPar = "";
	if (dijit.byId("cboOCA_CON_COD_TDO").get("value") == "0"
			|| dijit.byId("cboOCA_CON_COD_TDO").get("value") == "") {
		vPar += "&tipoDoc=0";
	} else {
		vPar += "&tipoDoc=" + dijit.byId("cboOCA_CON_COD_TDO").get("value");
	}
	vPar += "&tipoArchivo=" + dijit.byId("cboOCA_CON_TIP_ARC").get("value");
	vPar += "&arcTipDoc=" + dijit.byId("cboOCA_CON_ARC_TDO").get("value");
	if (!isNaN(dijit.byId("txtOCA_CON_ARC_NDO").get("value"))) {
		vPar += "&arcNroDoc=" + dijit.byId("txtOCA_CON_ARC_NDO").get("value");
	} else {
		vPar += "&arcNroDoc=";
	}
	vPar += "&arcDato1=" + dijit.byId("txtOCA_CON_ARC_DA1").get("value");
	vPar += "&arcDato2=" + dijit.byId("txtOCA_CON_ARC_DA2").get("value");
	vPar += "&arcDato3=" + dijit.byId("txtOCA_CON_ARC_DA3").get("value");
	vPar += "&arcDato4=" + dijit.byId("txtOCA_CON_ARC_DA4").get("value");
	// Obtengo las fechas
	var vFInDes = 20180101;
	var vFInHas = 21000101;
	if (dijit.byId("chkOCA_CON_FEC_ING").get("checked")) {
		if (dijit.byId("dtxOCA_CON_FEC_IND").get("value") != null) {
			vFInDes = dojo.date.locale.format(dijit.byId("dtxOCA_CON_FEC_IND")
					.get("value"), {
				datePattern : "yyyyMMdd",
				selector : "date"
			});
		}
		if (dijit.byId("dtxOCA_CON_FEC_INH").get("value") != null) {
			vFInHas = dojo.date.locale.format(dijit.byId("dtxOCA_CON_FEC_INH")
					.get("value"), {
				datePattern : "yyyyMMdd",
				selector : "date"
			});
		}
	}
	vPar += "&fechaIngDesde=" + vFInDes;
	vPar += "&fechaIngHasta=" + vFInHas;
	return vPar;
}

function fOCAArcLim() {
	dijit.byId("cboOCA_CON_COD_GDO").set("value", "");
	// dijit.byId("cboOCA_CON_COD_TDO").set("value", "");
	dijit.byId("cboOCA_CON_TIP_ARC").set("value", "");
	dijit.byId("cboOCA_CON_ARC_TDO").set("value", "0");
	dijit.byId("txtOCA_CON_ARC_NDO").set("value", "");
	dijit.byId("txtOCA_CON_ARC_DA1").set("value", "");
	dijit.byId("txtOCA_CON_ARC_DA2").set("value", "");
	dijit.byId("txtOCA_CON_ARC_DA3").set("value", "");
	dijit.byId("txtOCA_CON_ARC_DA4").set("value", "");
	dijit.byId("chkOCA_CON_FEC_ING").set("checked", false);
}

function fOCAArcVol() {
	if (fSessionValidate().pSft) {
		fOCAArcVolExec();
	}
}

function fOCAArcVolExec() {
	document.getElementById("divOCAFil").style.display = "inline";
	document.getElementById("divOCAArc").style.display = "none";
	fOCASolCle();
	fOCAArcCle();
}

function fOCAArcDet() {
	if (fSessionValidate().pSft) {
		fOCAArcDetExec();
	}
}

function fOCAArcDetExec() {
	var oGrid = dijit.byId("dgrOCAArcLis");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un archivo.", "Advertencia", "W");
		return;
	}
	// Ver Solicitud
	require([ "dojo/request", "dijit/Tree", "dojo/data/ItemFileWriteStore",
			"dojo/data/ItemFileReadStore", "dijit/tree/ForestStoreModel",
			"dojo/domReady!" ], function(request, Tree, ItemFileWriteStore,
			ItemFileReadStore, ForestStoreModel) {
		var vURL = fGetURLSvc("OperationService/getSolicitudList?cache="
				+ fGetCacheRnd() + "&producto=" + oItems[0].COD_PRO[0]
				+ "&solicitud=" + oItems[0].NRO_SOL[0]);
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			response = fJSONParse(response, 1);
			if (!!response && !!response.REGS && !!response.REGS.REG[0]) {
				var vJSON = response.REGS.REG[0];
				// Si da error
				if (vJSON == null) {
					return;
				}
				fOCASolCle();
				fOCAArcCle();
				// Botones y paneles
				document.getElementById("divOCAArc").style.display = "none";
				document.getElementById("divOCADet").style.display = "inline";
				// Datos
				fOCASolDat(vJSON);
				fOCASolRet(vJSON.NRO_PRO);
				fOCAArcDat(oItems[0]);
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fOCASolDat(vJSON) {
	// Cargar Datos
	document.getElementById("txtOCA_SOL_NRO_SOL").innerHTML = DOMPurify
			.sanitize(vJSON.COD_PRO + " " + vJSON.NRO_SOL);
	document.getElementById("txtOCA_SOL_NRO_SOL").producto = vJSON.COD_PRO;
	document.getElementById("txtOCA_SOL_NRO_SOL").solicitud = vJSON.NRO_SOL;
	var vNRO_SOL = "<table><tr><td><b>Propuesta: </b></td><td>" + vJSON.NRO_PRO
			+ "</td></tr>";
	if (vJSON.NRO_POL != "") {
		vNRO_SOL += "<tr><td>&nbsp;</td><td></td></tr>"
				+ "<tr><td><b>P&oacute;liza: </b></td><td>" + vJSON.NRO_POL
				+ "</td></tr></table>";
	} else {
		vNRO_SOL += "</table>";
	}
	require([ "dojo/ready", "dijit/Tooltip" ], function(ready, Tooltip) {
		ready(function() {
			new Tooltip({
				id : "tltOCA_SOL_NRO_SOL",
				connectId : [ "txtOCA_SOL_NRO_SOL" ],
				label : vNRO_SOL
			});
		});
	});
	document.getElementById("txtOCA_SOL_FEC_ING").innerHTML = DOMPurify
			.sanitize(vJSON.FEC_ING);
	document.getElementById("txtOCA_SOL_ASE_SOL").innerHTML = DOMPurify
			.sanitize(vJSON.ASE_TDD + " " + vJSON.ASE_NDO + " " + vJSON.ASE_APE
					+ " " + vJSON.ASE_NOM);
	document.getElementById("txtOCA_SOL_COT_SUM").innerHTML = DOMPurify
			.sanitize(vJSON.COT_SUM);
	document.getElementById("txtOCA_SOL_COT_PRI").innerHTML = DOMPurify
			.sanitize(vJSON.COT_PRI);
	if (vJSON.COD_OFI.length > 10) {
		document.getElementById("txtOCA_SOL_COD_OFI").innerHTML = DOMPurify
				.sanitize(vJSON.COD_OFI.substr(0, 10))
				+ "...";
		require([ "dojo/ready", "dijit/Tooltip" ], function(ready, Tooltip) {
			ready(function() {
				new Tooltip({
					id : "tltOCA_SOL_COD_OFI",
					connectId : [ "txtOCA_SOL_COD_OFI" ],
					label : vJSON.COD_OFI
				});
			});
		});
	} else {
		document.getElementById("txtOCA_SOL_COD_OFI").innerHTML = DOMPurify
				.sanitize(vJSON.COD_OFI);
	}
	document.getElementById("txtOCA_SOL_DES_EST").innerHTML = DOMPurify
			.sanitize(vJSON.DES_EST);
	document.getElementById("txtOCA_SOL_DES_EST").estado = vJSON.COD_EST;
	if (vJSON.DES_OTR != "") {
		require([ "dojo/ready", "dijit/Tooltip" ], function(ready, Tooltip) {
			ready(function() {
				new Tooltip({
					id : "tltOCA_SOL_DES_EST",
					connectId : [ "txtOCA_SOL_DES_EST" ],
					label : "<b>Motivo: </b>" + vJSON.DES_OTR
				});
			});
		});
	}
	document.getElementById("txtOCA_SOL_UMA_FEC").innerHTML = DOMPurify
			.sanitize(vJSON.UMA_FEC);
	document.getElementById("txtOCA_SOL_UMA_USU").innerHTML = DOMPurify
			.sanitize(vJSON.UMA_COD + " " + vJSON.UMA_APE + " " + vJSON.UMA_NOM);
	document.getElementById("txtOCA_SOL_VEN_SOL").innerHTML = DOMPurify
			.sanitize(vJSON.VEN_COD + " " + vJSON.VEN_APE + " " + vJSON.VEN_NOM);
	dijit.byId("txtOCA_SOL_OBS_SOL").set("value", vJSON.OBS_SOL);
}

function fOCASolRet(vPropuesta) {
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
				fOCASolRTl(response.CAMPOS);
			}
		});
	});
}

function fOCASolRTl(vJSON) {
	if (vJSON.CANTDOC > 0 || vJSON.CANTRET > 0) {
		document.getElementById("txtOCA_SOL_RET_DOC").style.display = "inline";
		// Retenciones
		var vArrRet = [];
		for (var i = 0; i < vJSON.CANTRET; i++) {
			if (!fOCASolRTlArr(vArrRet, vJSON.RETS.RET[i].DESCRIP)) {
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
			if (!fOCASolRTlArr(vArrDoc, vJSON.DOCS.DOC[i].DESCRIP)) {
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
					id : "tltOCA_SOL_RET_DOC",
					connectId : [ "txtOCA_SOL_RET_DOC" ],
					label : vStrRet + vStrDoc
				});
			});
		});
	}
}

function fOCASolRTlArr(vArr, vVal) {
	for (var i = 0; i < vArr.length; i++) {
		if (vArr[i] == vVal) {
			return true;
		}
	}
	return false;
}

function fOCAArcDat(vItem) {
	// Datos
	document.getElementById("txtOCA_ARC_DES_TDO").innerHTML = DOMPurify
			.sanitize(vItem.DES_TDO[0]);
	require([ "dojo/ready", "dijit/Tooltip" ], function(ready, Tooltip) {
		ready(function() {
			new Tooltip({
				id : "tltOCA_ARC_DES_TDO",
				connectId : [ "txtOCA_ARC_DES_TDO" ],
				label : "<b>Grupo: </b>" + vItem.DES_GDO[0]
			});
		});
	});
	document.getElementById("txtOCA_ARC_TIP_ARC").innerHTML = DOMPurify
			.sanitize(vItem.TIP_ARC[0]);
	document.getElementById("txtOCA_ARC_TIP_ARC").archivo = vItem.NRO_ARC[0];
	document.getElementById("txtOCA_ARC_TIP_ARC").indBaja = vItem.IND_BAJ[0];
	document.getElementById("txtOCA_ARC_UIN_FEC").innerHTML = DOMPurify
			.sanitize(vItem.UIN_FEC[0]);
	document.getElementById("txtOCA_ARC_UIN_USU").innerHTML = DOMPurify
			.sanitize(vItem.UIN_COD[0] + " " + vItem.UIN_APE[0] + " "
					+ vItem.UIN_NOM[0]);
	document.getElementById("txtOCA_ARC_ARC_DOC").innerHTML = DOMPurify
			.sanitize(vItem.ARC_TDD[0] + " " + vItem.ARC_NDO[0]);
	document.getElementById("txtOCA_ARC_ARC_DA1").innerHTML = DOMPurify
			.sanitize(vItem.ARC_DA1[0]);
	document.getElementById("txtOCA_ARC_ARC_DA2").innerHTML = DOMPurify
			.sanitize(vItem.ARC_DA2[0]);
	document.getElementById("txtOCA_ARC_ARC_DA3").innerHTML = DOMPurify
			.sanitize(vItem.ARC_DA3[0]);
	document.getElementById("txtOCA_ARC_ARC_DA4").innerHTML = DOMPurify
			.sanitize(vItem.ARC_DA4[0]);
	dijit.byId("txtOCA_ARC_OBS_ARC").set("value", vItem.OBS_ARC[0]);
}

function fOCAArcVie() {
	if (fSessionValidate().pSft) {
		fOCAArcVieExec();
	}
}

function fOCAArcVieExec() {
	// Visualizacion
	if (document.getElementById("txtOCA_ARC_TIP_ARC").indBaja == "0") {
		var vNRO_ARC = document.getElementById("txtOCA_ARC_TIP_ARC").archivo;
		var vTIP_ARC = document.getElementById("txtOCA_ARC_TIP_ARC").innerHTML;
		window.open(fGetURLMVC("downloadSvc.html?" + "cache=" + fGetCacheRnd()
				+ "&proceso=SOL" + "&archivo=" + vNRO_ARC + "&tipoArchivo="
				+ vTIP_ARC), "viewArc",
				"resizable=yes,height=700,width=900,top=100,left=100");
	} else if (document.getElementById("txtOCA_ARC_TIP_ARC").indBaja == "2") {
		fMsgBox("El archivo fue depurado en proceso autom&aacute;tico.",
				"Advertencia", "W");
	} else if (document.getElementById("txtOCA_ARC_TIP_ARC").indBaja == "3") {
		fMsgBox("El archivo fue enviado a FileNet.", "Advertencia", "W");
	} else {
		fMsgBox("Se produjo un error al leer el archivo.", "Error", "E");
	}
}

function fOCAArcDej() {
	if (fSessionValidate().pSft) {
		fOCAArcDejExec();
	}
}

function fOCAArcDejExec() {
	// ReadOnly
	document.getElementById("divOCAArc").style.display = "inline";
	document.getElementById("divOCADet").style.display = "none";
	fOCASolCle();
	fOCAArcCle();
}

function fOCAArcTDo() {
	// Cargar Combo Tipos Documentales
	if (dijit.byId("cboOCA_CON_COD_GDO").get("value") != "0"
			&& dijit.byId("cboOCA_CON_COD_GDO").get("value") != "") {
		require(
				[ "dojo/request", "dojo/domReady!" ],
				function(request) {
					var vURL = fGetURLSvc("ParametersService/getTipoDocumentalList?cache="
							+ fGetCacheRnd()
							+ "&tipoDoc=0&grupoDoc="
							+ dijit.byId("cboOCA_CON_COD_GDO").get("value")
							+ "&indBaja=false");
					var deferred = request.get(vURL, {
						handleAs : "json",
						sync : true
					});
					deferred.then(function(response) {
						if (!response.error) {
							response = fJSONParse(response, 2);
							if (!!response) {
								fComboClean("cboOCA_CON_COD_TDO");
								fComboAllLoad(response, "cboOCA_CON_COD_TDO",
										"COD_TDO", "DES_TDO", "...", "0");
							}
						}
					});
				});
	} else {
		fComboClean("cboOCA_CON_COD_TDO");
	}
}