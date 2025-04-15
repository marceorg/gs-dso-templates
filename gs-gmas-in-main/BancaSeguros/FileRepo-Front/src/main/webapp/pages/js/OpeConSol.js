function onOCSLoad() {
	// Inicializar
	fOCSInit();
	fOCSArcROn(true);
	fMnuDeselect();
}

function fOCSInit() {
	// Resize
	fBrowserResize();
	// Ancho de botones
	dojo.style("btnOCSSolCon", "width", "150px");
	dojo.style("btnOCSSolLim", "width", "100px");
	dojo.style("btnOCSSolDet", "width", "120px");
	dojo.style("btnOCSSolVol", "width", "120px");
	dojo.style("btnOCSSolExl", "width", "120px");
	dojo.style("btnOCSSolHis", "width", "120px");
	dojo.style("btnOCSSolDej", "width", "100px");
	dojo.style("btnOCSArcVie", "width", "100px");
	dojo.style("btnOCSSolCkl", "width", "100px");
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
				fOCSParFecHoy(response.result);
			}
		});
	});
	// Fases
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("ParametersService/getFaseList?cache="
				+ fGetCacheRnd() + "&perfil=&producto=");
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			if (!response.error) {
				response = fJSONParse(response, 2);
				if (!!response) {
					fComboAllLoad(response, "cboOCS_CON_COD_FAS", "COD_FAS",
							"DES_FAS", "...", "0");
				}
			}
		});
	});
	// Estados
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("ParametersService/getEstadoList?cache="
				+ fGetCacheRnd() + "&estadoActual=0");
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			if (!response.error) {
				response = fJSONParse(response, 2);
				if (!!response) {
					fOCSParEstCbo(response);
				}
			}
		});
	});
	// Motivos
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("ParametersService/getPendMotivoList?cache="
				+ fGetCacheRnd());
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			if (!response.error) {
				response = fJSONParse(response, 2);
				if (!!response) {
					fComboAllLoad(response, "cboOCS_CON_COD_OTR", "COD_MOT",
							"DES_MOT", "...", "0");
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
					fOCSParTDoCbo(response);
				}
			}
		});
	});
}

function fOCSParFecHoy(vRes) {
	document.getElementById("hidOCSFecHoy").value = vRes;
}

function fOCSParEstCbo(vRes) {
	fComboClean("cboOCS_CON_COD_EST");
	var oCbo = dijit.byId("cboOCS_CON_COD_EST");
	var vJSON = vRes;
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

function fOCSParTDoCbo(vRes) {
	fComboClean("cboOCS_CON_ASE_TDO");
	var oCbo = dijit.byId("cboOCS_CON_ASE_TDO");
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

function fOCSSolEstOtr() {
	dijit.byId("cboOCS_CON_COD_OTR").set("value", "0");
	document.getElementById("spaOCS_CON_OTR").style.display = "none";
	if (dijit.byId("cboOCS_CON_COD_EST").get("value") != "0") {
		if (dijit.byId("cboOCS_CON_COD_EST").get("value").split("|")[1] == "CBO_MOT") {
			document.getElementById("spaOCS_CON_OTR").style.display = "inline";
		}
	}
}

function fOCSSolCle() {
	// Datos
	document.getElementById("txtOCS_SOL_NRO_SOL").innerHTML = "";
	document.getElementById("txtOCS_SOL_NRO_SOL").cntArch = 0;
	document.getElementById("txtOCS_SOL_NRO_SOL").producto = "";
	document.getElementById("txtOCS_SOL_NRO_SOL").solicitud = "";
	fDestroyElement("tltOCS_SOL_NRO_SOL");
	document.getElementById("txtOCS_SOL_FEC_ING").innerHTML = "";
	document.getElementById("txtOCS_SOL_ASE_SOL").innerHTML = "";
	document.getElementById("txtOCS_SOL_COT_SUM").innerHTML = "";
	document.getElementById("txtOCS_SOL_COT_PRI").innerHTML = "";
	document.getElementById("txtOCS_SOL_COD_OFI").innerHTML = "";
	fDestroyElement("tltOCS_SOL_COD_OFI");
	document.getElementById("txtOCS_SOL_DES_EST").innerHTML = "";
	document.getElementById("txtOCS_SOL_DES_EST").estado = "";
	fDestroyElement("tltOCS_SOL_DES_EST");
	document.getElementById("txtOCS_SOL_UMA_FEC").innerHTML = "";
	document.getElementById("txtOCS_SOL_UMA_USU").innerHTML = "";
	document.getElementById("txtOCS_SOL_VEN_SOL").innerHTML = "";
	fDestroyElement("tltOCS_SOL_RET_DOC");
	document.getElementById("txtOCS_SOL_RET_DOC").style.display = "none";
	// Tree
	if (dijit.byId("treOCSArc") != null) {
		fDestroyElement("treOCSArc");
		document.getElementById("tdOCSArc").innerHTML = '<div id="_divOCSArc" style="width: 400px; height: 500px;"></div>';
	}
}

function fOCSArcROn(value) {
	// Botones
	dijit.byId("btnOCSArcVie").set("disabled", value);
}

function fOCSArcCle() {
	// Datos
	document.getElementById("txtOCS_ARC_DES_TDO").innerHTML = "";
	fDestroyElement("tltOCS_ARC_DES_TDO");
	document.getElementById("txtOCS_ARC_TIP_ARC").innerHTML = "";
	document.getElementById("txtOCS_ARC_TIP_ARC").archivo = "";
	document.getElementById("txtOCS_ARC_TIP_ARC").indBaja = "";
	document.getElementById("txtOCS_ARC_UIN_FEC").innerHTML = "";
	document.getElementById("txtOCS_ARC_UIN_USU").innerHTML = "";
	document.getElementById("txtOCS_ARC_ARC_DOC").innerHTML = "";
	document.getElementById("txtOCS_ARC_ARC_DA1").innerHTML = "";
	document.getElementById("txtOCS_ARC_ARC_DA2").innerHTML = "";
	document.getElementById("txtOCS_ARC_ARC_DA3").innerHTML = "";
	document.getElementById("txtOCS_ARC_ARC_DA4").innerHTML = "";
	dijit.byId("txtOCS_ARC_OBS_ARC").set("value", "");
}

function fOCSConFInChk() {
	if (dijit.byId("chkOCS_CON_FEC_ING").get("checked")) {
		dijit.byId("dtxOCS_CON_FEC_IND").set("disabled", false);
		dijit.byId("dtxOCS_CON_FEC_INH").set("disabled", false);
		dijit.byId("dtxOCS_CON_FEC_IND").set(
				"value",
				fFormatDTB(fDateAdd(
						document.getElementById("hidOCSFecHoy").value, -7)));
		dijit.byId("dtxOCS_CON_FEC_INH").set("value",
				fFormatDTB(document.getElementById("hidOCSFecHoy").value));
	} else {
		dijit.byId("dtxOCS_CON_FEC_IND").set("disabled", true);
		dijit.byId("dtxOCS_CON_FEC_INH").set("disabled", true);
		dijit.byId("dtxOCS_CON_FEC_IND").set("value", null);
		dijit.byId("dtxOCS_CON_FEC_INH").set("value", null);
	}
}

function fOCSConFMaChk() {
	if (dijit.byId("chkOCS_CON_FEC_MAN").get("checked")) {
		dijit.byId("dtxOCS_CON_FEC_MAD").set("disabled", false);
		dijit.byId("dtxOCS_CON_FEC_MAH").set("disabled", false);
		dijit.byId("dtxOCS_CON_FEC_MAD").set(
				"value",
				fFormatDTB(fDateAdd(
						document.getElementById("hidOCSFecHoy").value, -7)));

		dijit.byId("dtxOCS_CON_FEC_MAH").set("value",
				fFormatDTB(document.getElementById("hidOCSFecHoy").value));
	} else {
		dijit.byId("dtxOCS_CON_FEC_MAD").set("disabled", true);
		dijit.byId("dtxOCS_CON_FEC_MAH").set("disabled", true);
		dijit.byId("dtxOCS_CON_FEC_MAD").set("value", null);
		dijit.byId("dtxOCS_CON_FEC_MAH").set("value", null);
	}
}

function fOCSSolCon() {
	if (fSessionValidate().pSft) {
		fOCSSolConExec();
	}
}

function fOCSSolConExec() {
	// Validar
	if (!fOCSSolConVal()) {
		return;
	}
	// Limpiar
	fGridTltDisconnect();
	// Consulta
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("OperationService/getSolFiltroList?cache="
				+ fGetCacheRnd() + fOCSSolConPar());
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
					name : "Fase",
					field : "DES_FAS",
					width : "70px"
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
				} ] ];

				if (dijit.byId("dgrOCSSolLis") == null) {
					oGrid = new DataGrid({
						id : "dgrOCSSolLis",
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
					}, "_divOCSSolLis");

					oGrid.startup();
				} else {
					dijit.byId("dgrOCSSolLis").setStructure(layout);
					dijit.byId("dgrOCSSolLis").setStore(jsonDataSource);
				}
				// Botones y paneles
				document.getElementById("divOCSFil").style.display = "none";
				document.getElementById("divOCSSol").style.display = "inline";
				fOCSSolCle();
				fOCSArcCle();
				dijit.byId("dgrOCSSolLis").update();
				document.getElementById("hTltExec").value = "S";
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fOCSSolConVal() {
	// Nro. Solicitud
	if (dijit.byId("txtOCS_CON_NRO_SOL").get("value") == undefined) {
		fMsgBox("N&uacute;mero de Solicitud:<br/>"
				+ "Debe ingresar un valor num&eacute;rico.",
				"Validaci&oacute;n", "W");
		return false;
	}
	// Fecha de Ingreso
	if (dijit.byId("chkOCS_CON_FEC_ING").get("checked")) {
		if (dijit.byId("dtxOCS_CON_FEC_IND").get("value") == null) {
			fMsgBox("Fecha de Ingreso:<br/>" + "Desde inv&aacute;lido.",
					"Validaci&oacute;n", "W");
			return false;
		}
		if (dijit.byId("dtxOCS_CON_FEC_INH").get("value") == null) {
			fMsgBox("Fecha de Ingreso:<br/>" + "Hasta inv&aacute;lido.",
					"Validaci&oacute;n", "W");
			return false;
		}
		// Obtengo las fechas
		var vFInDes = dojo.date.locale.format(dijit.byId("dtxOCS_CON_FEC_IND")
				.get("value"), {
			datePattern : "yyyyMMdd",
			selector : "date"
		});
		var vFInHas = dojo.date.locale.format(dijit.byId("dtxOCS_CON_FEC_INH")
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
		if (vFInHas > document.getElementById("hidOCSFecHoy").value) {
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
	// Fecha de Actualizacion
	if (dijit.byId("chkOCS_CON_FEC_MAN").get("checked")) {
		if (dijit.byId("dtxOCS_CON_FEC_MAD").get("value") == null) {
			fMsgBox("Fecha de Actualizaci&oacute;n:<br/>"
					+ "Desde inv&aacute;lido.", "Validaci&oacute;n", "W");
			return false;
		}
		if (dijit.byId("dtxOCS_CON_FEC_MAH").get("value") == null) {
			fMsgBox("Fecha de Actualizaci&oacute;n:<br/>"
					+ "Hasta inv&aacute;lido.", "Validaci&oacute;n", "W");
			return false;
		}
		// Obtengo las fechas
		var vFMaDes = dojo.date.locale.format(dijit.byId("dtxOCS_CON_FEC_MAD")
				.get("value"), {
			datePattern : "yyyyMMdd",
			selector : "date"
		});
		var vFMaHas = dojo.date.locale.format(dijit.byId("dtxOCS_CON_FEC_MAH")
				.get("value"), {
			datePattern : "yyyyMMdd",
			selector : "date"
		});
		// Rango
		if (vFMaHas < vFMaDes) {
			fMsgBox("Fecha de Actualizaci&oacute;n:<br/>"
					+ "Hasta debe ser mayor o igual a Desde.",
					"Validaci&oacute;n", "W");
			return false;
		}
		if (vFMaHas > document.getElementById("hidOCSFecHoy").value) {
			fMsgBox("Fecha de Actualizaci&oacute;n:<br/>"
					+ "Hasta no debe ser mayor a la fecha actual.",
					"Validaci&oacute;n", "W");
			return false;
		}
		if (fDateAdd(vFMaDes, 60) < vFMaHas) {
			fMsgBox("Fecha de Actualizaci&oacute;n:<br/>"
					+ "El rango no debe superar los 60 d&iacute;as.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	// Nro. Documento
	if (dijit.byId("txtOCS_CON_ASE_NDO").get("value") == undefined) {
		fMsgBox("N&uacute;mero de Documento:<br/>"
				+ "Debe ingresar un valor num&eacute;rico.",
				"Validaci&oacute;n", "W");
		return false;
	}
	// Apellido y Nombre
	if (dijit.byId("txtOCS_CON_ASE_APE").get("value") != "") {
		if (dijit.byId("txtOCS_CON_ASE_APE").get("value").length < 4) {
			fMsgBox("Apellido del asegurado:<br/>"
					+ "Debe ingresar al menos 4 caracteres.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	if (dijit.byId("txtOCS_CON_ASE_NOM").get("value") != "") {
		if (dijit.byId("txtOCS_CON_ASE_NOM").get("value").length < 4) {
			fMsgBox("Nombre del asegurado:<br/>"
					+ "Debe ingresar al menos 4 caracteres.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	// Verificar que se selecciono algun filtro
	if (dijit.byId("txtOCS_CON_COD_PRO").get("value") == ""
			&& isNaN(dijit.byId("txtOCS_CON_NRO_SOL").get("value"))
			&& dijit.byId("txtOCS_CON_NRO_PRO").get("value") == ""
			&& dijit.byId("cboOCS_CON_COD_FAS").get("value") == "0"
			&& dijit.byId("cboOCS_CON_COD_EST").get("value") == "0"
			&& dijit.byId("txtOCS_CON_COD_OFI").get("value") == ""
			&& dijit.byId("txtOCS_CON_VEN_COD").get("value") == ""
			&& dijit.byId("chkOCS_CON_FEC_ING").get("checked") == false
			&& dijit.byId("chkOCS_CON_FEC_MAN").get("checked") == false
			&& dijit.byId("cboOCS_CON_ASE_TDO").get("value") == "0"
			&& isNaN(dijit.byId("txtOCS_CON_ASE_NDO").get("value"))
			&& dijit.byId("txtOCS_CON_ASE_APE").get("value") == ""
			&& dijit.byId("txtOCS_CON_ASE_NOM").get("value") == "") {
		fMsgBox("Debe seleccionar al menos un filtro de b&uacute;squeda.",
				"Validaci&oacute;n", "W");
		return false;
	}
	return true;
}

function fOCSSolConPar() {
	var vPar = "";
	vPar += "&producto=" + dijit.byId("txtOCS_CON_COD_PRO").get("value");
	if (!isNaN(dijit.byId("txtOCS_CON_NRO_SOL").get("value"))) {
		vPar += "&solicitud=" + dijit.byId("txtOCS_CON_NRO_SOL").get("value");
	} else {
		vPar += "&solicitud=0";
	}
	vPar += "&propuesta=" + dijit.byId("txtOCS_CON_NRO_PRO").get("value");
	vPar += "&fase=" + dijit.byId("cboOCS_CON_COD_FAS").get("value");
	if (dijit.byId("cboOCS_CON_COD_EST").get("value") != "0") {
		vPar += "&estado="
				+ dijit.byId("cboOCS_CON_COD_EST").get("value").split("|")[0];
	} else {
		vPar += "&estado=0";
	}
	vPar += "&otro=" + dijit.byId("cboOCS_CON_COD_OTR").get("value");
	vPar += "&oficina=" + dijit.byId("txtOCS_CON_COD_OFI").get("value");
	vPar += "&asesor=" + dijit.byId("txtOCS_CON_VEN_COD").get("value");
	// Obtengo las fechas
	var vFInDes = 20180101;
	var vFInHas = 21000101;
	if (dijit.byId("chkOCS_CON_FEC_ING").get("checked")) {
		if (dijit.byId("dtxOCS_CON_FEC_IND").get("value") != null) {
			vFInDes = dojo.date.locale.format(dijit.byId("dtxOCS_CON_FEC_IND")
					.get("value"), {
				datePattern : "yyyyMMdd",
				selector : "date"
			});
		}
		if (dijit.byId("dtxOCS_CON_FEC_INH").get("value") != null) {
			vFInHas = dojo.date.locale.format(dijit.byId("dtxOCS_CON_FEC_INH")
					.get("value"), {
				datePattern : "yyyyMMdd",
				selector : "date"
			});
		}
	}
	var vFMaDes = 20180101;
	var vFMaHas = 21000101;
	if (dijit.byId("chkOCS_CON_FEC_MAN").get("checked")) {
		if (dijit.byId("dtxOCS_CON_FEC_MAD").get("value") != null) {
			vFMaDes = dojo.date.locale.format(dijit.byId("dtxOCS_CON_FEC_MAD")
					.get("value"), {
				datePattern : "yyyyMMdd",
				selector : "date"
			});
		}
		if (dijit.byId("dtxOCS_CON_FEC_MAH").get("value") != null) {
			vFMaHas = dojo.date.locale.format(dijit.byId("dtxOCS_CON_FEC_MAH")
					.get("value"), {
				datePattern : "yyyyMMdd",
				selector : "date"
			});
		}
	}
	vPar += "&fechaIngDesde=" + vFInDes;
	vPar += "&fechaIngHasta=" + vFInHas;
	vPar += "&fechaManDesde=" + vFMaDes;
	vPar += "&fechaManHasta=" + vFMaHas;
	vPar += "&asegTipDoc=" + dijit.byId("cboOCS_CON_ASE_TDO").get("value");
	if (!isNaN(dijit.byId("txtOCS_CON_ASE_NDO").get("value"))) {
		vPar += "&asegNroDoc=" + dijit.byId("txtOCS_CON_ASE_NDO").get("value");
	} else {
		vPar += "&asegNroDoc=";
	}
	vPar += "&asegApellido=" + dijit.byId("txtOCS_CON_ASE_APE").get("value");
	vPar += "&asegNombre=" + dijit.byId("txtOCS_CON_ASE_NOM").get("value");
	return vPar;
}

function fOCSSolLim() {
	dijit.byId("txtOCS_CON_COD_PRO").set("value", "");
	dijit.byId("txtOCS_CON_NRO_SOL").set("value", "");
	dijit.byId("txtOCS_CON_NRO_PRO").set("value", "");
	dijit.byId("cboOCS_CON_COD_FAS").set("value", "0");
	dijit.byId("cboOCS_CON_COD_EST").set("value", "0");
	dijit.byId("txtOCS_CON_COD_OFI").set("value", "");
	dijit.byId("txtOCS_CON_VEN_COD").set("value", "");
	dijit.byId("chkOCS_CON_FEC_ING").set("checked", false);
	dijit.byId("chkOCS_CON_FEC_MAN").set("checked", false);
	dijit.byId("cboOCS_CON_ASE_TDO").set("value", "0");
	dijit.byId("txtOCS_CON_ASE_NDO").set("value", "");
	dijit.byId("txtOCS_CON_ASE_APE").set("value", "");
	dijit.byId("txtOCS_CON_ASE_NOM").set("value", "");
}

function fOCSSolVol() {
	if (fSessionValidate().pSft) {
		fOCSSolVolExec();
	}
}

function fOCSSolVolExec() {
	document.getElementById("divOCSFil").style.display = "inline";
	document.getElementById("divOCSSol").style.display = "none";
	fOCSSolCle();
	fOCSArcROn(true);
	fOCSArcCle();
}

function fOCSSolDet() {
	if (fSessionValidate().pSft) {
		fOCSSolDetExec();
	}
}

function fOCSSolDetExec() {
	var oGrid = dijit.byId("dgrOCSSolLis");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar una solicitud.", "Advertencia", "W");
		return;
	}
	// Ver Solicitud
	require([ "dojo/request", "dijit/Tree", "dojo/data/ItemFileWriteStore",
			"dojo/data/ItemFileReadStore", "dijit/tree/ForestStoreModel",
			"dojo/domReady!" ], function(request, Tree, ItemFileWriteStore,
			ItemFileReadStore, ForestStoreModel) {
		var vURL = fGetURLSvc("OperationService/getArchivoXSolList?cache="
				+ fGetCacheRnd() + "&producto=" + oItems[0].COD_PRO[0]
				+ "&solicitud=" + oItems[0].NRO_SOL[0] + "&archivo=0");
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
				var vArcTre = fOCSSolTomArc(vJSON);
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
				fOCSSolCle();
				fOCSSolTomTre(vTreeModel);
				// Botones y paneles
				document.getElementById("divOCSSol").style.display = "none";
				document.getElementById("divOCSArc").style.display = "inline";
				// Datos
				fOCSSolTomDat(oItems[0]);
				fOCSSolTomRet(oItems[0].NRO_PRO[0]);
				fOCSArcROn(true);
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fOCSSolTomArc(vJSON) {
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

function fOCSSolTomTre(vTreeModel) {
	if (dijit.byId("treOCSArc") == null) {
		oTree = dijit.Tree({
			id : "treOCSArc",
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
				fOCSArcDat(item);
			},
			onDblClick : function(item) {
				fOCSArcVie();
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
		}, "_divOCSArc");

		oTree.startup();
	}
}

function fOCSSolTomDat(vItem) {
	// Cargar Datos
	document.getElementById("txtOCS_SOL_NRO_SOL").innerHTML = DOMPurify
			.sanitize(vItem.COD_PRO[0] + " " + vItem.NRO_SOL[0]);
	document.getElementById("txtOCS_SOL_NRO_SOL").producto = vItem.COD_PRO[0];
	document.getElementById("txtOCS_SOL_NRO_SOL").solicitud = vItem.NRO_SOL[0];
	var vNRO_SOL = "<table><tr><td><b>Propuesta: </b></td><td>"
			+ vItem.NRO_PRO[0] + "</td></tr>";
	if (vItem.NRO_POL[0] != "") {
		vNRO_SOL += "<tr><td>&nbsp;</td><td></td></tr>"
				+ "<tr><td><b>P&oacute;liza: </b></td><td>" + vItem.NRO_POL[0]
				+ "</td></tr></table>";
	} else {
		vNRO_SOL += "</table>";
	}
	require([ "dojo/ready", "dijit/Tooltip" ], function(ready, Tooltip) {
		ready(function() {
			new Tooltip({
				id : "tltOCS_SOL_NRO_SOL",
				connectId : [ "txtOCS_SOL_NRO_SOL" ],
				label : vNRO_SOL
			});
		});
	});
	document.getElementById("txtOCS_SOL_FEC_ING").innerHTML = DOMPurify
			.sanitize(vItem.FEC_ING[0]);
	document.getElementById("txtOCS_SOL_ASE_SOL").innerHTML = DOMPurify
			.sanitize(vItem.ASE_TDD[0] + " " + vItem.ASE_NDO[0] + " "
					+ vItem.ASE_APE[0] + " " + vItem.ASE_NOM[0]);

	if (vItem.COD_PRO[0].substr(0, 1) == "I") {
		document.getElementById("lblOCS_SOL_COT_PRI").innerHTML = "Prima:";
		document.getElementById("lblOCS_SOL_COT_SUM").innerHTML = "Suma Aseg./Plus:";
		document.getElementById("txtOCS_SOL_COT_SUM").innerHTML = DOMPurify
				.sanitize(vItem.COT_SUM[0] + " / " + vItem.COT_PLU[0]);
		document.getElementById("txtOCS_SOL_COT_PRI").innerHTML = DOMPurify
				.sanitize(vItem.COT_PRI[0]);
	} else if (vItem.COD_PRO[0].substr(0, 1) == "R") {
		document.getElementById("lblOCS_SOL_COT_PRI").innerHTML = "Aporte Inicial:";
		document.getElementById("lblOCS_SOL_COT_SUM").innerHTML = "";
		if (vItem.COT_PLU[0] == "A") {
			document.getElementById("lblOCS_SOL_COT_SUM").innerHTML = "Aporte Peri&oacute;dico:";
		} else if (vItem.COT_PLU[0] == "F") {
			document.getElementById("lblOCS_SOL_COT_SUM").innerHTML = "Fondo Deseado:";
		} else if (vItem.COT_PLU[0] == "R") {
			document.getElementById("lblOCS_SOL_COT_SUM").innerHTML = "Renta Deseada:";
		}
		document.getElementById("txtOCS_SOL_COT_SUM").innerHTML = DOMPurify
				.sanitize(vItem.COT_SUM[0]);
		document.getElementById("txtOCS_SOL_COT_PRI").innerHTML = DOMPurify
				.sanitize(vItem.COT_PRI[0]);
	} else if (vItem.COD_PRO[0].substr(0, 1) == "M") {
		document.getElementById("lblOCS_SOL_COT_PRI").innerHTML = "Precio:";
		document.getElementById("lblOCS_SOL_COT_SUM").innerHTML = "Actividad Excluida:";
		document.getElementById("txtOCS_SOL_COT_PRI").innerHTML = DOMPurify
				.sanitize(vItem.COT_PRI[0]);
		document.getElementById("txtOCS_SOL_COT_SUM").innerHTML = (vItem.COT_PLU[0] == "S" ? "SI"
				: "NO");
	}
	if (vItem.COD_OFI[0].length > 10) {
		document.getElementById("txtOCS_SOL_COD_OFI").innerHTML = DOMPurify
				.sanitize(vItem.COD_OFI[0].substr(0, 10))
				+ "...";
		require([ "dojo/ready", "dijit/Tooltip" ], function(ready, Tooltip) {
			ready(function() {
				new Tooltip({
					id : "tltOCS_SOL_COD_OFI",
					connectId : [ "txtOCS_SOL_COD_OFI" ],
					label : vItem.COD_OFI[0]
				});
			});
		});
	} else {
		document.getElementById("txtOCS_SOL_COD_OFI").innerHTML = DOMPurify
				.sanitize(vItem.COD_OFI[0]);
	}
	document.getElementById("txtOCS_SOL_DES_EST").innerHTML = DOMPurify
			.sanitize(vItem.DES_EST[0]);
	document.getElementById("txtOCS_SOL_DES_EST").estado = DOMPurify
			.sanitize(vItem.COD_EST[0]);
	if (vItem.DES_OTR[0] != "") {
		require([ "dojo/ready", "dijit/Tooltip" ], function(ready, Tooltip) {
			ready(function() {
				new Tooltip({
					id : "tltOCS_SOL_DES_EST",
					connectId : [ "txtOCS_SOL_DES_EST" ],
					label : "<b>Motivo: </b>" + vItem.DES_OTR[0]
				});
			});
		});
	}
	document.getElementById("txtOCS_SOL_UMA_FEC").innerHTML = DOMPurify
			.sanitize(vItem.UMA_FEC[0]);
	document.getElementById("txtOCS_SOL_UMA_USU").innerHTML = DOMPurify
			.sanitize(vItem.UMA_COD[0] + " " + vItem.UMA_APE[0] + " "
					+ vItem.UMA_NOM[0]);
	document.getElementById("txtOCS_SOL_VEN_SOL").innerHTML = DOMPurify
			.sanitize(vItem.VEN_COD[0] + " " + vItem.VEN_APE[0] + " "
					+ vItem.VEN_NOM[0]);
	dijit.byId("txtOCS_SOL_OBS_SOL").set("value", vItem.OBS_SOL[0]);
	if (vItem.TIP_SOL[0] == "N") {
		document.getElementById("txtOCS_SOL_TIP_SOL").innerHTML = "ONLINE";
	} else if (vItem.TIP_SOL[0] == "F") {
		document.getElementById("txtOCS_SOL_TIP_SOL").innerHTML = "OFFLINE";
	} else {
		document.getElementById("txtOCS_SOL_TIP_SOL").innerHTML = "Tipo No Asig.";
	}
}

function fOCSSolTomRet(vPropuesta) {
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
				fOCSSolTomRTl(response.CAMPOS);
			}
		});
	});
}

function fOCSSolTomRTl(vJSON) {
	if (vJSON.CANTDOC > 0 || vJSON.CANTRET > 0) {
		document.getElementById("txtOCS_SOL_RET_DOC").style.display = "inline";
		// Retenciones
		var vArrRet = [];
		for (var i = 0; i < vJSON.CANTRET; i++) {
			if (!fOCSSolTomRTlArr(vArrRet, vJSON.RETS.RET[i].DESCRIP)) {
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
			if (!fOCSSolTomRTlArr(vArrDoc, vJSON.DOCS.DOC[i].DESCRIP)) {
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
					id : "tltOCS_SOL_RET_DOC",
					connectId : [ "txtOCS_SOL_RET_DOC" ],
					label : vStrRet + vStrDoc
				});
			});
		});
	}
}

function fOCSSolTomRTlArr(vArr, vVal) {
	for (var i = 0; i < vArr.length; i++) {
		if (vArr[i] == vVal) {
			return true;
		}
	}
	return false;
}

function fOCSSolHis() {
	if (fSessionValidate().pSft) {
		fOCSSolHisExec();
	}
}

function fOCSSolHisExec() {
	var oGrid = dijit.byId("dgrOCSSolLis");
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
				fOCSSolHisDat(response.REGS.REG[0]);
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

				if (dijit.byId("dgrOCSHisLis") == null) {
					oGrid = new DataGrid({
						id : "dgrOCSHisLis",
						store : jsonDataSource,
						structure : layout,
						rowSelector : "25px",
						rowCount : 20,
						style : 'height: 300px;',
						selectionMode : "none",
						onMouseOver : function() {
							fGridTltConnect();
						}
					}, "_divOCSHisLis");

					oGrid.startup();
				} else {
					dijit.byId("dgrOCSHisLis").setStructure(layout);
					dijit.byId("dgrOCSHisLis").setStore(jsonDataSource);
				}
				// Botones y paneles
				dijit.byId("dlgOCSHisBox").show();
				dijit.byId("dgrOCSHisLis").update();
				document.getElementById("hTltExec").value = "S";
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fOCSSolHisDat(vJSON) {
	document.getElementById("txtOCS_HIS_NRO_SOL").innerHTML = DOMPurify
			.sanitize(vJSON.COD_PRO + " " + vJSON.NRO_SOL);
	fDestroyElement("tltOCS_HIS_NRO_SOL");
	require([ "dojo/ready", "dijit/Tooltip" ], function(ready, Tooltip) {
		ready(function() {
			new Tooltip({
				id : "tltOCS_HIS_NRO_SOL",
				connectId : [ "txtOCS_HIS_NRO_SOL" ],
				label : "<b>Propuesta: </b>" + vJSON.NRO_PRO
			});
		});
	});
	document.getElementById("txtOCS_HIS_FEC_ING").innerHTML = DOMPurify
			.sanitize(vJSON.FEC_ING);
	document.getElementById("txtOCS_HIS_ASE_SOL").innerHTML = DOMPurify
			.sanitize(vJSON.ASE_TDD + " " + vJSON.ASE_NDO + " " + vJSON.ASE_APE
					+ " " + vJSON.ASE_NOM);
	document.getElementById("txtOCS_HIS_COD_OFI").innerHTML = DOMPurify
			.sanitize(vJSON.COD_OFI);
	document.getElementById("txtOCS_HIS_VEN_SOL").innerHTML = DOMPurify
			.sanitize(vJSON.VEN_COD + " " + vJSON.VEN_APE + " " + vJSON.VEN_NOM);
}

function fOCSArcDat(vItem) {
	if (vItem.NRO_ARC != undefined) {
		// Paneles
		fOCSArcCle();
		fOCSArcROn(false);
		// Datos
		document.getElementById("txtOCS_ARC_DES_TDO").innerHTML = vItem.DES_TDO[0];
		require([ "dojo/ready", "dijit/Tooltip" ], function(ready, Tooltip) {
			ready(function() {
				new Tooltip({
					id : "tltOCS_ARC_DES_TDO",
					connectId : [ "txtOCS_ARC_DES_TDO" ],
					label : "<b>Grupo: </b>" + vItem.DES_GDO[0]
				});
			});
		});
		document.getElementById("txtOCS_ARC_TIP_ARC").innerHTML = vItem.TIP_ARC[0];
		document.getElementById("txtOCS_ARC_TIP_ARC").archivo = vItem.NRO_ARC[0];
		document.getElementById("txtOCS_ARC_TIP_ARC").indBaja = vItem.IND_BAJ[0];
		document.getElementById("txtOCS_ARC_UIN_FEC").innerHTML = vItem.UIN_FEC[0];
		document.getElementById("txtOCS_ARC_UIN_USU").innerHTML = vItem.UIN_COD[0]
				+ " " + vItem.UIN_APE[0] + " " + vItem.UIN_NOM[0];
		document.getElementById("txtOCS_ARC_ARC_DOC").innerHTML = vItem.ARC_TDD[0]
				+ " " + vItem.ARC_NDO[0];
		document.getElementById("txtOCS_ARC_ARC_DA1").innerHTML = vItem.ARC_DA1[0];
		document.getElementById("txtOCS_ARC_ARC_DA2").innerHTML = vItem.ARC_DA2[0];
		document.getElementById("txtOCS_ARC_ARC_DA3").innerHTML = vItem.ARC_DA3[0];
		document.getElementById("txtOCS_ARC_ARC_DA4").innerHTML = vItem.ARC_DA4[0];
		dijit.byId("txtOCS_ARC_OBS_ARC").set("value", vItem.OBS_ARC[0]);
	} else {
		fOCSArcROn(true);
		fOCSArcCle();
	}
}

function fOCSArcVie() {
	if (fSessionValidate().pSft) {
		fOCSArcVieExec();
	}
}

function fOCSArcVieExec() {
	// Visualizacion
	if (!dijit.byId("btnOCSArcVie").get("disabled")) {
		if (document.getElementById("txtOCS_ARC_TIP_ARC").indBaja == "0") {
			document.getElementById("txtOCS_SOL_NRO_SOL").cntArch++;
			var vNRO_ARC = document.getElementById("txtOCS_ARC_TIP_ARC").archivo;
			var vTIP_ARC = document.getElementById("txtOCS_ARC_TIP_ARC").innerHTML;
			var vCNT_ARC = document.getElementById("txtOCS_SOL_NRO_SOL").cntArch;
			if (vCNT_ARC > 10) {
				document.getElementById("txtOCS_SOL_NRO_SOL").cntArch = 0;
			}
			window.open(fGetURLMVC("downloadSvc.html?" + "cache="
					+ fGetCacheRnd() + "&proceso=SOL" + "&archivo=" + vNRO_ARC
					+ "&tipoArchivo=" + vTIP_ARC), "viewArc" + vNRO_ARC,
					"resizable=yes,height=700,width=900,top="
							+ String(90 + (vCNT_ARC * 10)) + ",left="
							+ String(90 + (vCNT_ARC * 10)));
		} else if (document.getElementById("txtOCS_ARC_TIP_ARC").indBaja == "2") {
			fMsgBox("El archivo fue depurado en proceso autom&aacute;tico.",
					"Advertencia", "W");
		} else if (document.getElementById("txtOCS_ARC_TIP_ARC").indBaja == "3") {
			fMsgBox("El archivo fue enviado a FileNet.", "Advertencia", "W");
		} else {
			fMsgBox("Se produjo un error al leer el archivo.", "Error", "E");
		}
	}
}

function fOCSSolDej() {
	if (fSessionValidate().pSft) {
		fOCSSolDejExec();
	}
}

function fOCSSolDejExec() {
	// ReadOnly
	document.getElementById("divOCSSol").style.display = "inline";
	document.getElementById("divOCSArc").style.display = "none";
	fOCSSolCle();
	fOCSArcROn(true);
	fOCSArcCle();
}

function fOCSSolExl() {
	if (fSessionValidate().pSft) {
		fOCSSolExlExec();
	}
}

function fOCSSolExlExec() {
	// Excel
	window.open(fGetURLMVC("dwlExcelSvc.html?" + "cache=" + fGetCacheRnd()
			+ "&tipoExl=S" + fOCSSolConPar()), "excelArc",
			"resizable=yes,height=700,width=900,top=100,left=100");
}

function fOCSSolCkl() {
	if (fSessionValidate().pSft) {
		fOCSSolCklExec();
	}
}

function fOCSSolCklExec() {
	// Checkear Checklist
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("OperationService/getSolicitCklList?cache="
				+ fGetCacheRnd() + "&producto="
				+ document.getElementById("txtOCS_SOL_NRO_SOL").producto
				+ "&solicitud="
				+ document.getElementById("txtOCS_SOL_NRO_SOL").solicitud);
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
					fOCSSolCklLst(vJSON);
				}
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fOCSSolCklLst(vJSON) {
	fComboClean("cboOCSCklLst");
	var oCbo = dijit.byId("cboOCSCklLst");
	// Cargar uno blanco
	var oOpt = {};
	oOpt.label = "Seleccionar...";
	oOpt.value = "0";
	oOpt.selected = true;
	oCbo.addOption(oOpt);
	// Recorrer los checklist
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
				oOpt.label = vJSON.REG[i].DES_FAS + " - Checklist "
						+ aChkLst[j];
				oOpt.value = vJSON.REG[i].COD_FAS + "|" + (j + 1) + "|"
						+ aChkLst[j] + "|N";
				oOpt.selected = false;
				oCbo.addOption(oOpt);
			}
		}
	}
	document.getElementById("hOCSCklLst").JSON_SOL = JSON.stringify(vJSON);
	dijit.byId("dlgOCSCklLstBox").show();
}

function fOCSCklLstVer() {
	if (dijit.byId("cboOCSCklLst").get("value") == "0") {
		fMsgBox("Debe seleccionar un Checklist.", "Advertencia", "W");
		return;
	}
	// Ocultar popup
	dijit.byId("dlgOCSCklLstBox").onCancel();
	var aChkLst = dijit.byId("cboOCSCklLst").get("value").split("|");
	document.getElementById("hOCSCklLst").fase = aChkLst[0];
	document.getElementById("hOCSCklLst").orden = aChkLst[1];
	document.getElementById("hOCSCklLst").version = aChkLst[2];
	document.getElementById("hOCSCklLst").habilitado = aChkLst[3];
	fOCSSolCklVie();
}

function fOCSSolCklVie() {
	var oCPD = dijit.byId("divOCSCklBox");
	var vInc = fGetURLPag("includes/checklist_v"
			+ document.getElementById("hOCSCklLst").version + ".html");
	oCPD.set("href", vInc);
	oCPD.set("onDownloadEnd", function() {
		fOCSSolCklLoa();
	});
	dijit.byId("dlgOCSCklBox").set("title",
			dijit.byId("cboOCSCklLst").get("displayedValue"));
	// Tamaño
	var vVer = document.getElementById("hOCSCklLst").version;
	if (vVer == "1" || vVer == "4" || vVer == "5") {
		dijit.byId("divOCSCklBox").set("style", "width: 400px; height: 450px;");
	} else if (vVer == "2" || vVer == "3") {
		dijit.byId("divOCSCklBox").set("style", "width: 585px; height: 450px;");
	}
	dijit.byId("dlgOCSCklBox").show();
}

function fOCSSolCklLoa() {
	var vFas = document.getElementById("hOCSCklLst").fase;
	var vOrd = document.getElementById("hOCSCklLst").orden;
	var vVer = document.getElementById("hOCSCklLst").version;
	// Fix Combos
	fOCSSolCklFix(vVer);
	// JSON Cheklist
	var vJSON = JSON.parse(document.getElementById("hOCSCklLst").JSON_SOL);
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
	document.getElementById("hOCSCklLst").format = vFmt;
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
			dijit.byId("cbo" + vCtl).set("disabled", true);
			vDPr = vDat.substring(vPos, vPos + vTam);
			dijit.byId("cbo" + vCtl).set("value", vDPr, false);
			// Otro Dato
			for (var k = 0; k < vTAr.length; k++) {
				vPos += vTam;
				vTTa = Number(vTAr[k]);
				vDPr = vDat.substring(vPos, vPos + vTTa);
				if (dijit.byId("cbo" + vCtl).get("value") == vTVa) {
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
			dijit.byId("txt" + vCtl).set("disabled", true);
			vDPr = vDat.substring(vPos, vPos + vTam);
			dijit.byId("txt" + vCtl).set("value", vDPr);
		}
		vPos += vTam;
	}
	// Usuario
	document.getElementById("txtCKL_UMA_FEC").innerHTML = vJSON.REG[i].UMA_FEC;
	document.getElementById("txtCKL_UMA_USU").innerHTML = vJSON.REG[i].UMA_COD
			+ " " + vJSON.REG[i].UMA_APE + " " + vJSON.REG[i].UMA_NOM;
}

function fOCSSolCklFix(vVer) {
	if (vVer == "2") {
		var vPrd = document.getElementById("txtOCS_SOL_NRO_SOL").producto;
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