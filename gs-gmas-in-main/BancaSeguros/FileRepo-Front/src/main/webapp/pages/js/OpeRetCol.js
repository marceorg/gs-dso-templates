function onORTLoad() {
	// Inicializar
	fORTInit();
	fORTArcROn(true);
	// Defaults
	dijit.byId("chkORT_CON_FEC_ING").set("checked", true);
	// Fin
	fMnuDeselect();
}

function fORTInit() {
	// Resize
	fBrowserResize();
	// Ancho de botones
	dojo.style("btnORTRCoCon", "width", "150px");
	dojo.style("btnORTRCoLim", "width", "100px");
	dojo.style("btnORTRCoDet", "width", "120px");
	dojo.style("btnORTRCoVol", "width", "120px");
	dojo.style("btnORTRCoDej", "width", "100px");
	dojo.style("btnORTArcVie", "width", "100px");
	dojo.style("btnORTArcAdd", "width", "120px");
	dojo.style("btnORTArcDel", "width", "120px");
	dojo.style("btnORTRCoEst", "width", "100px");
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
				fORTParFecHoy(response.result);
			}
		});
	});
	// Estados
	fORTParEstCbo("cboORT_CON_COD_EST", true);
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
					fORTParTDoCbo(response);
				}
			}
		});
	});
}

function fORTParFecHoy(vRes) {
	document.getElementById("hidORTFecHoy").value = vRes;
}

function fORTParEstCbo(vCbo, vNuevo) {
	fComboClean(vCbo);
	var oCbo = dijit.byId(vCbo);
	// Cargar uno en todos
	var oOpt = {};
	oOpt.label = "...";
	oOpt.value = "0";
	oOpt.selected = true;
	oCbo.addOption(oOpt);
	if (vNuevo) {
		oOpt = {};
		oOpt.label = "NUEVO";
		oOpt.value = "1";
		oCbo.addOption(oOpt);
	}
	oOpt = {};
	oOpt.label = "PENDIENTE";
	oOpt.value = "5";
	oCbo.addOption(oOpt);
	oOpt = {};
	oOpt.label = "VERIFICADO";
	oOpt.value = "3";
	oCbo.addOption(oOpt);
	oOpt = {};
	oOpt.label = "ANULADO";
	oOpt.value = "6";
	oCbo.addOption(oOpt);
}

function fORTParTDoCbo(vRes) {
	fComboClean("cboORT_CON_ASE_TDO");
	fComboClean("cboORT_CON_TOM_TDO");
	var oCboA = dijit.byId("cboORT_CON_ASE_TDO");
	var oCboT = dijit.byId("cboORT_CON_TOM_TDO");
	var vJSON = vRes;
	// Cargar uno en todos
	var oOpt = {};
	oOpt.label = "...";
	oOpt.value = "0";
	oOpt.selected = true;
	oCboA.addOption(oOpt);
	oCboT.addOption(oOpt);
	// Cargar combo
	for ( var i in vJSON.TIPOS.TIPO) {
		oOpt = {};
		oOpt.label = vJSON.TIPOS.TIPO[i].POV_DES_TDO;
		oOpt.value = String(vJSON.TIPOS.TIPO[i].POV_COD_TDO);
		oOpt.selected = false;
		oCboA.addOption(oOpt);
		oCboT.addOption(oOpt);
	}
}

function fORTRCoEstOtr() {
	dijit.byId("cboORT_CON_COD_OTR").set("value", "0");
	document.getElementById("spaORT_CON_OTR").style.display = "none";
	if (dijit.byId("cboORT_CON_COD_EST").get("value") != "0") {
		if (dijit.byId("cboORT_CON_COD_EST").get("value").split("|")[1] == "CBO_MOT") {
			document.getElementById("spaORT_CON_OTR").style.display = "inline";
		}
	}
}

function fORTRCoCle() {
	// Datos
	document.getElementById("txtORT_RCO_NRO_OPE").innerHTML = "";
	document.getElementById("txtORT_RCO_NRO_OPE").cntArch = 0;
	document.getElementById("txtORT_RCO_NRO_OPE").producto = "";
	document.getElementById("txtORT_RCO_NRO_OPE").operacion = "";
	document.getElementById("txtORT_RCO_NRO_OPE").permiso = false;
	document.getElementById("txtORT_RCO_FEC_ING").innerHTML = "";
	document.getElementById("txtORT_RCO_NRO_POL").innerHTML = "";
	document.getElementById("txtORT_RCO_ASE_RCO").innerHTML = "";
	document.getElementById("txtORT_RCO_DES_EST").innerHTML = "";
	document.getElementById("txtORT_RCO_DES_EST").estado = "";
	document.getElementById("txtORT_RCO_UMA_FEC").innerHTML = "";
	document.getElementById("txtORT_RCO_UMA_USU").innerHTML = "";
	dijit.byId("txtORT_RCO_OBS_OPE").set("value", "");
	// Tree
	if (dijit.byId("treORTArc") != null) {
		fDestroyElement("treORTArc");
		document.getElementById("tdORTArc").innerHTML = '<div id="_divORTArc" style="width: 400px; height: 500px;"></div>';
	}
}

function fORTArcROn(value) {
	// Botones
	dijit.byId("btnORTArcVie").set("disabled", value);
	if (document.getElementById("txtORT_RCO_NRO_OPE").permiso) {
		dijit.byId("btnORTArcDel").set("disabled", value);
	}
}

function fORTArcCle() {
	// Datos
	document.getElementById("txtORT_ARC_DES_ARC").innerHTML = "";
	document.getElementById("txtORT_ARC_TIP_ARC").innerHTML = "";
	document.getElementById("txtORT_ARC_TIP_ARC").archivo = "";
	document.getElementById("txtORT_ARC_TIP_ARC").estArch = "";
	document.getElementById("txtORT_ARC_UIN_FEC").innerHTML = "";
	document.getElementById("txtORT_ARC_UIN_USU").innerHTML = "";
	document.getElementById("txtORT_ARC_IDE_ARC").innerHTML = "";
	dijit.byId("txtORT_ARC_OBS_ARC").set("value", "");
}

function fORTConFInChk() {
	if (dijit.byId("chkORT_CON_FEC_ING").get("checked")) {
		dijit.byId("dtxORT_CON_FEC_IND").set("disabled", false);
		dijit.byId("dtxORT_CON_FEC_INH").set("disabled", false);
		dijit.byId("dtxORT_CON_FEC_IND").set(
				"value",
				fFormatDTB(fDateAdd(
						document.getElementById("hidORTFecHoy").value, -7)));
		dijit.byId("dtxORT_CON_FEC_INH").set("value",
				fFormatDTB(document.getElementById("hidORTFecHoy").value));
	} else {
		dijit.byId("dtxORT_CON_FEC_IND").set("disabled", true);
		dijit.byId("dtxORT_CON_FEC_INH").set("disabled", true);
		dijit.byId("dtxORT_CON_FEC_IND").set("value", null);
		dijit.byId("dtxORT_CON_FEC_INH").set("value", null);
	}
}

function fORTConFMaChk() {
	if (dijit.byId("chkORT_CON_FEC_MAN").get("checked")) {
		dijit.byId("dtxORT_CON_FEC_MAD").set("disabled", false);
		dijit.byId("dtxORT_CON_FEC_MAH").set("disabled", false);
		dijit.byId("dtxORT_CON_FEC_MAD").set(
				"value",
				fFormatDTB(fDateAdd(
						document.getElementById("hidORTFecHoy").value, -7)));

		dijit.byId("dtxORT_CON_FEC_MAH").set("value",
				fFormatDTB(document.getElementById("hidORTFecHoy").value));
	} else {
		dijit.byId("dtxORT_CON_FEC_MAD").set("disabled", true);
		dijit.byId("dtxORT_CON_FEC_MAH").set("disabled", true);
		dijit.byId("dtxORT_CON_FEC_MAD").set("value", null);
		dijit.byId("dtxORT_CON_FEC_MAH").set("value", null);
	}
}

function fORTRCoCon() {
	if (fSessionValidate().pSft) {
		fORTRCoConExec();
	}
}

function fORTRCoConExec() {
	// Validar
	if (!fORTRCoConVal()) {
		return;
	}
	// Limpiar
	fGridTltDisconnect();
	// Consulta
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("OperationService/getRCoFiltroList?cache="
				+ fGetCacheRnd() + fORTRCoConPar());
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
					name : "P&oacute;liza",
					fields : [ "COD_PRO", "NRO_POL" ],
					formatter : fDgrColMul,
					width : "90px"
				}, {
					name : "Fecha de Ingreso",
					field : "FEC_ING",
					width : "105px"
				}, {
					name : "Asegurado",
					fields : [ "ASE_NDO", "ASE_TDD" ],
					formatter : fDgrColMul,
					width : "70px"
				}, {
					name : "Apellido y nombre",
					fields : [ "ASE_APE", "ASE_NOM" ],
					formatter : fDgrColMul,
					width : "100px"
				}, {
					name : "Tomador",
					fields : [ "TOM_NDO", "TOM_TDD" ],
					formatter : fDgrColMul,
					width : "70px"
				}, {
					name : "Raz&oacute;n Social",
					fields : [ "TOM_APE", "TOM_NOM" ],
					formatter : fDgrColMul,
					width : "100px"
				}, {
					name : "DDJJ",
					field : "REQ_ADI",
					formatter : fORTDgrColDDJ,
					width : "50px"
				}, {
					name : "R.Med.",
					field : "REQ_ADI",
					formatter : fORTDgrColRMe,
					width : "50px"
				}, {
					name : "Estado",
					field : "DES_EST",
					width : "70px"
				}, {
					name : "Fec.Actualiz.",
					field : "UMA_FEC",
					width : "60px"
				}, {
					name : "&Uacute;ltimo Usuario",
					fields : [ "UMA_COD", "UMA_APE", "UMA_NOM", "OBS_OPE" ],
					formatter : fDgrColMlT,
					width : "120px"
				} ] ];

				if (dijit.byId("dgrORTRCoLis") == null) {
					oGrid = new DataGrid({
						id : "dgrORTRCoLis",
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
					}, "_divORTRCoLis");

					oGrid.startup();
				} else {
					dijit.byId("dgrORTRCoLis").setStructure(layout);
					dijit.byId("dgrORTRCoLis").setStore(jsonDataSource);
				}
				// Botones y paneles
				document.getElementById("divORTFil").style.display = "none";
				document.getElementById("divORTRCo").style.display = "inline";
				fORTRCoCle();
				fORTArcCle();
				dijit.byId("dgrORTRCoLis").update();
				document.getElementById("hTltExec").value = "S";
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fORTDgrColDDJ(value) {
	// DDJJ
	var vDDJ = String(value);
	if (vDDJ != "") {
		vDDJ = "SI";
	} else {
		vDDJ = "NO";
	}
	return vDDJ;
}

function fORTDgrColRMe(value) {
	// Req.Medicos
	var vRMe = String(value);
	if (vRMe != "3") {
		vRMe = "NO";
	} else {
		vRMe = "SI";
	}
	return vRMe;
}

function fORTReqAdi(vVal) {
	if (vVal == "D") {
		if (dijit.byId("cboORT_CON_RAD_DDJ").get("value") == "") {
			dijit.byId("cboORT_CON_RAD_RME").set("value", "", false);
		} else if (dijit.byId("cboORT_CON_RAD_DDJ").get("value") == "N"
				&& dijit.byId("cboORT_CON_RAD_RME").get("value") == "S") {
			dijit.byId("cboORT_CON_RAD_RME").set("value", "N", false);
		} else if (dijit.byId("cboORT_CON_RAD_DDJ").get("value") != ""
				&& dijit.byId("cboORT_CON_RAD_RME").get("value") == "") {
			dijit.byId("cboORT_CON_RAD_RME").set("value", "N", false);
		}
	} else if (vVal == "M") {
		if (dijit.byId("cboORT_CON_RAD_RME").get("value") == "") {
			dijit.byId("cboORT_CON_RAD_DDJ").set("value", "", false);
		} else if (dijit.byId("cboORT_CON_RAD_RME").get("value") == "S"
				&& dijit.byId("cboORT_CON_RAD_DDJ").get("value") != "S") {
			dijit.byId("cboORT_CON_RAD_DDJ").set("value", "S", false);
		} else if (dijit.byId("cboORT_CON_RAD_RME").get("value") == "N"
				&& dijit.byId("cboORT_CON_RAD_DDJ").get("value") == "") {
			dijit.byId("cboORT_CON_RAD_DDJ").set("value", "N", false);
		}
	}
}

function fORTRCoConVal() {
	// Nro. Operacion
	if (dijit.byId("txtORT_CON_NRO_OPE").get("value") == undefined) {
		fMsgBox("N&uacute;mero de Operaci&oacute;n:<br/>"
				+ "Debe ingresar un valor num&eacute;rico.",
				"Validaci&oacute;n", "W");
		return false;
	}
	// Fecha de Ingreso
	if (dijit.byId("chkORT_CON_FEC_ING").get("checked")) {
		if (dijit.byId("dtxORT_CON_FEC_IND").get("value") == null) {
			fMsgBox("Fecha de Ingreso:<br/>" + "Desde inv&aacute;lido.",
					"Validaci&oacute;n", "W");
			return false;
		}
		if (dijit.byId("dtxORT_CON_FEC_INH").get("value") == null) {
			fMsgBox("Fecha de Ingreso:<br/>" + "Hasta inv&aacute;lido.",
					"Validaci&oacute;n", "W");
			return false;
		}
		// Obtengo las fechas
		var vFInDes = dojo.date.locale.format(dijit.byId("dtxORT_CON_FEC_IND")
				.get("value"), {
			datePattern : "yyyyMMdd",
			selector : "date"
		});
		var vFInHas = dojo.date.locale.format(dijit.byId("dtxORT_CON_FEC_INH")
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
		if (vFInHas > document.getElementById("hidORTFecHoy").value) {
			fMsgBox("Fecha de Ingreso:<br/>"
					+ "Hasta no debe ser mayor a la fecha actual.",
					"Validaci&oacute;n", "W");
			return false;
		}
		if (fDateAdd(vFInDes, 365) < vFInHas) {
			fMsgBox("Fecha de Ingreso:<br/>"
					+ "El rango no debe superar los 365 d&iacute;as.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	// Fecha de Actualizacion
	if (dijit.byId("chkORT_CON_FEC_MAN").get("checked")) {
		if (dijit.byId("dtxORT_CON_FEC_MAD").get("value") == null) {
			fMsgBox("Fecha de Actualizaci&oacute;n:<br/>"
					+ "Desde inv&aacute;lido.", "Validaci&oacute;n", "W");
			return false;
		}
		if (dijit.byId("dtxORT_CON_FEC_MAH").get("value") == null) {
			fMsgBox("Fecha de Actualizaci&oacute;n:<br/>"
					+ "Hasta inv&aacute;lido.", "Validaci&oacute;n", "W");
			return false;
		}
		// Obtengo las fechas
		var vFMaDes = dojo.date.locale.format(dijit.byId("dtxORT_CON_FEC_MAD")
				.get("value"), {
			datePattern : "yyyyMMdd",
			selector : "date"
		});
		var vFMaHas = dojo.date.locale.format(dijit.byId("dtxORT_CON_FEC_MAH")
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
		if (vFMaHas > document.getElementById("hidORTFecHoy").value) {
			fMsgBox("Fecha de Actualizaci&oacute;n:<br/>"
					+ "Hasta no debe ser mayor a la fecha actual.",
					"Validaci&oacute;n", "W");
			return false;
		}
		if (fDateAdd(vFMaDes, 365) < vFMaHas) {
			fMsgBox("Fecha de Actualizaci&oacute;n:<br/>"
					+ "El rango no debe superar los 365 d&iacute;as.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	// Nro. Documento
	if (dijit.byId("txtORT_CON_ASE_NDO").get("value") == undefined) {
		fMsgBox("N&uacute;mero de Documento:<br/>"
				+ "Debe ingresar un valor num&eacute;rico.",
				"Validaci&oacute;n", "W");
		return false;
	}
	// Apellido y Nombre
	if (dijit.byId("txtORT_CON_ASE_APE").get("value") != "") {
		if (dijit.byId("txtORT_CON_ASE_APE").get("value").length < 4) {
			fMsgBox("Apellido del asegurado:<br/>"
					+ "Debe ingresar al menos 4 caracteres.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	if (dijit.byId("txtORT_CON_ASE_NOM").get("value") != "") {
		if (dijit.byId("txtORT_CON_ASE_NOM").get("value").length < 4) {
			fMsgBox("Nombre del asegurado:<br/>"
					+ "Debe ingresar al menos 4 caracteres.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	// Nro. Documento
	if (dijit.byId("txtORT_CON_TOM_NDO").get("value") == undefined) {
		fMsgBox("N&uacute;mero de Documento:<br/>"
				+ "Debe ingresar un valor num&eacute;rico.",
				"Validaci&oacute;n", "W");
		return false;
	}
	// Apellido y Nombre
	if (dijit.byId("txtORT_CON_TOM_APE").get("value") != "") {
		if (dijit.byId("txtORT_CON_TOM_APE").get("value").length < 4) {
			fMsgBox("Apellido del tomador:<br/>"
					+ "Debe ingresar al menos 4 caracteres.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	if (dijit.byId("txtORT_CON_TOM_NOM").get("value") != "") {
		if (dijit.byId("txtORT_CON_TOM_NOM").get("value").length < 4) {
			fMsgBox("Nombre del tomador:<br/>"
					+ "Debe ingresar al menos 4 caracteres.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	// Verificar que se selecciono algun filtro
	if (isNaN(dijit.byId("txtORT_CON_NRO_OPE").get("value"))
			&& dijit.byId("txtORT_CON_COD_PRO").get("value") == ""
			&& dijit.byId("txtORT_CON_NRO_POL").get("value") == ""
			&& dijit.byId("cboORT_CON_COD_EST").get("value") == "0"
			&& dijit.byId("cboORT_CON_RAD_DDJ").get("value") == ""
			&& dijit.byId("cboORT_CON_RAD_RME").get("value") == ""
			&& dijit.byId("chkORT_CON_FEC_ING").get("checked") == false
			&& dijit.byId("chkORT_CON_FEC_MAN").get("checked") == false
			&& dijit.byId("cboORT_CON_ASE_TDO").get("value") == "0"
			&& isNaN(dijit.byId("txtORT_CON_ASE_NDO").get("value"))
			&& dijit.byId("txtORT_CON_ASE_APE").get("value") == ""
			&& dijit.byId("txtORT_CON_ASE_NOM").get("value") == ""
			&& dijit.byId("cboORT_CON_TOM_TDO").get("value") == "0"
			&& isNaN(dijit.byId("txtORT_CON_TOM_NDO").get("value"))
			&& dijit.byId("txtORT_CON_TOM_APE").get("value") == ""
			&& dijit.byId("txtORT_CON_TOM_NOM").get("value") == "") {
		fMsgBox("Debe seleccionar al menos un filtro de b&uacute;squeda.",
				"Validaci&oacute;n", "W");
		return false;
	}
	return true;
}

function fORTRCoConPar() {
	var vPar = "";
	vPar += "&producto=" + dijit.byId("txtORT_CON_COD_PRO").get("value");
	if (!isNaN(dijit.byId("txtORT_CON_NRO_OPE").get("value"))) {
		vPar += "&operacion=" + dijit.byId("txtORT_CON_NRO_OPE").get("value");
	} else {
		vPar += "&operacion=0";
	}
	vPar += "&poliza=" + dijit.byId("txtORT_CON_NRO_POL").get("value");
	vPar += "&estado=" + dijit.byId("cboORT_CON_COD_EST").get("value");
	// Obtengo las fechas
	var vFInDes = 20180101;
	var vFInHas = 21000101;
	if (dijit.byId("chkORT_CON_FEC_ING").get("checked")) {
		if (dijit.byId("dtxORT_CON_FEC_IND").get("value") != null) {
			vFInDes = dojo.date.locale.format(dijit.byId("dtxORT_CON_FEC_IND")
					.get("value"), {
				datePattern : "yyyyMMdd",
				selector : "date"
			});
		}
		if (dijit.byId("dtxORT_CON_FEC_INH").get("value") != null) {
			vFInHas = dojo.date.locale.format(dijit.byId("dtxORT_CON_FEC_INH")
					.get("value"), {
				datePattern : "yyyyMMdd",
				selector : "date"
			});
		}
	}
	var vFMaDes = 20180101;
	var vFMaHas = 21000101;
	if (dijit.byId("chkORT_CON_FEC_MAN").get("checked")) {
		if (dijit.byId("dtxORT_CON_FEC_MAD").get("value") != null) {
			vFMaDes = dojo.date.locale.format(dijit.byId("dtxORT_CON_FEC_MAD")
					.get("value"), {
				datePattern : "yyyyMMdd",
				selector : "date"
			});
		}
		if (dijit.byId("dtxORT_CON_FEC_MAH").get("value") != null) {
			vFMaHas = dojo.date.locale.format(dijit.byId("dtxORT_CON_FEC_MAH")
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
	vPar += "&asegTipDoc=" + dijit.byId("cboORT_CON_ASE_TDO").get("value");
	if (!isNaN(dijit.byId("txtORT_CON_ASE_NDO").get("value"))) {
		vPar += "&asegNroDoc=" + dijit.byId("txtORT_CON_ASE_NDO").get("value");
	} else {
		vPar += "&asegNroDoc=";
	}
	vPar += "&asegApellido=" + dijit.byId("txtORT_CON_ASE_APE").get("value");
	vPar += "&asegNombre=" + dijit.byId("txtORT_CON_ASE_NOM").get("value");
	vPar += "&tomaTipDoc=" + dijit.byId("cboORT_CON_TOM_TDO").get("value");
	if (!isNaN(dijit.byId("txtORT_CON_TOM_NDO").get("value"))) {
		vPar += "&tomaNroDoc=" + dijit.byId("txtORT_CON_TOM_NDO").get("value");
	} else {
		vPar += "&tomaNroDoc=";
	}
	vPar += "&tomaApellido=" + dijit.byId("txtORT_CON_TOM_APE").get("value");
	vPar += "&tomaNombre=" + dijit.byId("txtORT_CON_TOM_NOM").get("value");
	vPar += "&reqAdic=";
	if (dijit.byId("cboORT_CON_RAD_DDJ").get("value") == "N"
			&& dijit.byId("cboORT_CON_RAD_RME").get("value") == "N") {
		vPar += "N";
	} else if (dijit.byId("cboORT_CON_RAD_DDJ").get("value") == "S"
			&& dijit.byId("cboORT_CON_RAD_RME").get("value") == "N") {
		vPar += "D";
	} else if (dijit.byId("cboORT_CON_RAD_DDJ").get("value") == "S"
			&& dijit.byId("cboORT_CON_RAD_RME").get("value") == "S") {
		vPar += "M";
	} else {
		vPar += "";
	}
	return vPar;
}

function fORTRCoLim() {
	dijit.byId("txtORT_CON_NRO_OPE").set("value", "");
	dijit.byId("txtORT_CON_COD_PRO").set("value", "");
	dijit.byId("txtORT_CON_NRO_POL").set("value", "");
	dijit.byId("cboORT_CON_COD_EST").set("value", "0");
	dijit.byId("cboORT_CON_RAD_DDJ").set("value", "", false);
	dijit.byId("cboORT_CON_RAD_RME").set("value", "", false);
	dijit.byId("chkORT_CON_FEC_ING").set("checked", false);
	dijit.byId("chkORT_CON_FEC_MAN").set("checked", false);
	dijit.byId("cboORT_CON_ASE_TDO").set("value", "0");
	dijit.byId("txtORT_CON_ASE_NDO").set("value", "");
	dijit.byId("txtORT_CON_ASE_APE").set("value", "");
	dijit.byId("txtORT_CON_ASE_NOM").set("value", "");
	dijit.byId("cboORT_CON_TOM_TDO").set("value", "0");
	dijit.byId("txtORT_CON_TOM_NDO").set("value", "");
	dijit.byId("txtORT_CON_TOM_APE").set("value", "");
	dijit.byId("txtORT_CON_TOM_NOM").set("value", "");
	// Defaults
	dijit.byId("chkORT_CON_FEC_ING").set("checked", true);
}

function fORTRCoVol() {
	if (fSessionValidate().pSft) {
		fORTRCoVolExec();
	}
}

function fORTRCoVolExec() {
	document.getElementById("divORTFil").style.display = "inline";
	document.getElementById("divORTRCo").style.display = "none";
	fORTRCoCle();
	fORTArcROn(true);
	fORTArcCle();
}

function fORTRCoDet() {
	var ssn = fSessionValidate();
	if (ssn.pSft) {
		fORTRCoDetExec(ssn.pSft, ssn.key, ssn.type);
	}
}

function fORTRCoDetExec(vPeopleSoft, vProfileKey, vProfileType) {
	var oGrid = dijit.byId("dgrORTRCoLis");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar una operaci&oacute;n.", "Advertencia", "W");
		return;
	}
	// Ver Operacion
	require(
			[ "dojo/request", "dijit/Tree", "dojo/data/ItemFileWriteStore",
					"dojo/data/ItemFileReadStore",
					"dijit/tree/ForestStoreModel", "dojo/domReady!" ],
			function(request, Tree, ItemFileWriteStore, ItemFileReadStore,
					ForestStoreModel) {
				var vURL = fGetURLSvc("OperationService/getArchivoXRCoList?cache="
						+ fGetCacheRnd()
						+ "&producto="
						+ oItems[0].COD_PRO[0]
						+ "&operacion="
						+ oItems[0].NRO_OPE[0]
						+ "&archivo=0&ideArch=");
				var deferred = request.get(vURL, {
					handleAs : "json",
					sync : true
				});
				deferred
						.then(
								function(response) {
									response = fJSONParse(response, 1);
									if (!!response) {
										var vJSON = response.REGS;
										// Si da error
										if (vJSON == null) {
											return;
										}
										// Recorrer el resultado
										var vArcTre = fORTRCoTomArc(vJSON);
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
										fORTRCoCle();
										fORTRCoTomTre(vTreeModel);
										// Botones y paneles
										document.getElementById("divORTRCo").style.display = "none";
										document.getElementById("divORTArc").style.display = "inline";
										// Datos
										fORTRCoTomDat(oItems[0], vProfileKey);
										fORTRCoGrant();
										fORTArcROn(true);
									}
								}, function(err) {
									fMsgBox("Se ha producido un error.",
											"Error", "E");
								});
			});
}

function fORTRCoTomArc(vJSON) {
	var vArcTre = [];
	var vArcDoc = [];

	for (var i = 0; i < vJSON.REG.length; i++) {
		// Genero la leyenda variable
		var vLabel = '<font color="red"><b>';
		vLabel += vJSON.REG[i].UIN_FEC + '</b></font>';
		if (vJSON.REG[i].IDE_ARC.length > 0) {
			if (vJSON.REG[i].IDE_ARC.substr(0, 7) == "PDF_ADJ") {
				vLabel += " - ARCHIVO ADJUNTO";
			} else if (vJSON.REG[i].IDE_ARC.substr(0, 7) == "PDF_GEN") {
				vLabel += " - ARCHIVO GENERADO";
			} else if (vJSON.REG[i].IDE_ARC.substr(4, 7) == "ARC_ADD") {
				vLabel += " - ARCHIVO AGREGADO";
			}
		} else {
			vLabel += " - ARCHIVO";
		}
		// Cargo el Archivo
		var vVal = {
			id : "1." + i,
			label : vLabel,
			tipo : "ARC",
			NRO_ARC : vJSON.REG[i].NRO_ARC,
			TIP_ARC : vJSON.REG[i].TIP_ARC,
			EST_ARC : vJSON.REG[i].EST_ARC,
			DES_ARC : vJSON.REG[i].DES_ARC,
			IDE_ARC : vJSON.REG[i].IDE_ARC,
			UIN_FEC : vJSON.REG[i].UIN_FEC,
			UIN_COD : vJSON.REG[i].UIN_COD,
			UIN_APE : vJSON.REG[i].UIN_APE,
			UIN_NOM : vJSON.REG[i].UIN_NOM,
			OBS_ARC : vJSON.REG[i].OBS_ARC
		};
		vArcDoc.push(vVal);
	}
	vArcTre.push({
		label : '<b>ARCHIVO DE R/V.COL.</b>',
		id : "1",
		tipo : "GDO",
		children : vArcDoc
	});
	vArcDoc = [];
	// Retorno
	return vArcTre;
}

function fORTRCoTomTre(vTreeModel) {
	if (dijit.byId("treORTArc") == null) {
		oTree = dijit.Tree({
			id : "treORTArc",
			style : 'width: 400px;height: 370px;',
			model : vTreeModel,
			autoExpand : true,
			showRoot : false,
			_createTreeNode : function(args) {
				var tnode = new dijit._TreeNode(args);
				tnode.labelNode.innerHTML = args.label;
				return tnode;
			},
			onClick : function(item) {
				fORTArcDat(item);
			},
			onDblClick : function(item) {
				fORTArcVie();
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
		}, "_divORTArc");

		oTree.startup();
	}
}

function fORTRCoTomDat(vItem, vProfileKey) {
	// Cargar Datos
	document.getElementById("txtORT_RCO_NRO_OPE").innerHTML = vItem.NRO_OPE[0];
	document.getElementById("txtORT_RCO_NRO_OPE").producto = vItem.COD_PRO[0];
	document.getElementById("txtORT_RCO_NRO_OPE").operacion = vItem.NRO_OPE[0];
	document.getElementById("txtORT_RCO_NRO_OPE").permiso = (vProfileKey != "E" ? false
			: true);
	document.getElementById("txtORT_RCO_FEC_ING").innerHTML = vItem.FEC_ING[0];
	document.getElementById("txtORT_RCO_NRO_POL").innerHTML = vItem.COD_PRO[0]
			+ " " + vItem.NRO_POL[0];
	document.getElementById("txtORT_RCO_ASE_RCO").innerHTML = vItem.ASE_TDD[0]
			+ " " + vItem.ASE_NDO[0] + " " + vItem.ASE_APE[0] + " "
			+ vItem.ASE_NOM[0];
	document.getElementById("txtORT_RCO_TOM_RCO").innerHTML = vItem.TOM_TDD[0]
			+ " " + vItem.TOM_NDO[0] + " " + vItem.TOM_APE[0] + " "
			+ vItem.TOM_NOM[0];
	document.getElementById("txtORT_RCO_RQA_DDJ").innerHTML = vItem.REQ_ADI[0] == "" ? "NO"
			: "SI";
	document.getElementById("txtORT_RCO_RQA_MED").innerHTML = vItem.REQ_ADI[0] == "3" ? "SI"
			: "NO";
	document.getElementById("txtORT_RCO_DES_EST").innerHTML = vItem.DES_EST[0];
	document.getElementById("txtORT_RCO_DES_EST").estado = vItem.COD_EST[0];
	document.getElementById("txtORT_RCO_UMA_FEC").innerHTML = vItem.UMA_FEC[0];
	document.getElementById("txtORT_RCO_UMA_USU").innerHTML = vItem.UMA_COD[0]
			+ " " + vItem.UMA_APE[0] + " " + vItem.UMA_NOM[0];
	dijit.byId("txtORT_RCO_OBS_OPE").set("value", vItem.OBS_OPE[0]);
}

function fORTRCoGrant() {
	// Botones
	if (document.getElementById("txtORT_RCO_DES_EST").estado != 1
			&& document.getElementById("txtORT_RCO_DES_EST").estado != 5) {
		dijit.byId("btnORTRCoEst").set("disabled", true);
		dijit.byId("btnORTArcAdd").set("disabled", true);
		dijit.byId("btnORTArcDel").set("disabled", true);
		document.getElementById("txtORT_RCO_NRO_OPE").permiso = false;
	} else if (!document.getElementById("txtORT_RCO_NRO_OPE").permiso) {
		dijit.byId("btnORTRCoEst").set("disabled", true);
		dijit.byId("btnORTArcAdd").set("disabled", true);
		dijit.byId("btnORTArcDel").set("disabled", true);
	} else {
		dijit.byId("btnORTRCoEst").set("disabled", false);
		dijit.byId("btnORTArcAdd").set("disabled", false);
	}
}

function fORTArcDat(vItem) {
	if (vItem.NRO_ARC != undefined) {
		// Paneles
		fORTArcCle();
		fORTArcROn(false);
		// Datos
		document.getElementById("txtORT_ARC_DES_ARC").innerHTML = vItem.DES_ARC[0];
		document.getElementById("txtORT_ARC_TIP_ARC").innerHTML = vItem.TIP_ARC[0];
		document.getElementById("txtORT_ARC_TIP_ARC").archivo = vItem.NRO_ARC[0];
		document.getElementById("txtORT_ARC_TIP_ARC").estArch = vItem.EST_ARC[0];
		document.getElementById("txtORT_ARC_UIN_FEC").innerHTML = vItem.UIN_FEC[0];
		document.getElementById("txtORT_ARC_UIN_USU").innerHTML = vItem.UIN_COD[0]
				+ " " + vItem.UIN_APE[0] + " " + vItem.UIN_NOM[0];
		document.getElementById("txtORT_ARC_IDE_ARC").innerHTML = vItem.IDE_ARC[0];
		dijit.byId("txtORT_ARC_OBS_ARC").set("value", vItem.OBS_ARC[0]);
	} else {
		fORTArcROn(true);
		fORTArcCle();
	}
}

function fORTArcVie() {
	if (fSessionValidate().pSft) {
		fORTArcVieExec();
	}
}

function fORTArcVieExec(vItem) {
	// Visualizacion
	if (!dijit.byId("btnORTArcVie").get("disabled")) {
		if (document.getElementById("txtORT_ARC_TIP_ARC").estArch == "0") {
			document.getElementById("txtORT_RCO_NRO_OPE").cntArch++;
			var vNRO_ARC = document.getElementById("txtORT_ARC_TIP_ARC").archivo;
			var vTIP_ARC = document.getElementById("txtORT_ARC_TIP_ARC").innerHTML;
			var vCNT_ARC = document.getElementById("txtORT_RCO_NRO_OPE").cntArch;
			if (vCNT_ARC > 10) {
				document.getElementById("txtORT_RCO_NRO_OPE").cntArch = 0;
			}
			window.open(fGetURLMVC("downloadSvc.html?" + "cache="
					+ fGetCacheRnd() + "&proceso=RCO" + "&archivo=" + vNRO_ARC
					+ "&tipoArchivo=" + vTIP_ARC), "viewArc" + vNRO_ARC,
					"resizable=yes,height=700,width=900,top="
							+ String(90 + (vCNT_ARC * 10)) + ",left="
							+ String(90 + (vCNT_ARC * 10)));
		} else if (document.getElementById("txtORT_ARC_TIP_ARC").estArch == "2") {
			fMsgBox("El archivo fue depurado en proceso autom&aacute;tico.",
					"Advertencia", "W");
		} else if (document.getElementById("txtORT_ARC_TIP_ARC").estArch == "3") {
			fMsgBox("El archivo fue enviado a FileNet.", "Advertencia", "W");
		} else {
			fMsgBox("Se produjo un error al leer el archivo.", "Error", "E");
		}
	}
}

function fORTArcAdd() {
	if (fSessionValidate().pSft) {
		fORTArcAddExec();
	}
}

function fORTArcAddExec() {
	// Limpiar y cargar
	document.frmORTUpload.reset();
	dijit.byId("cboORT_AGR_TAR").set("value", "");
	dijit.byId("txtORT_AGR_DES").set("value", "");
	dijit.byId("txtORT_AGR_IDE").set("value", "");
	dijit.byId("txtORT_AGR_OBS").set("value", "");
	dijit.byId("dlgORTUplBox").show();
}

function fORTArcUpl() {
	if (fSessionValidate().pSft) {
		fORTArcUplExec();
	}
}

function fORTArcUplExec() {
	// Validacion de datos
	if (dijit.byId("cboORT_AGR_TAR").get("value") == "") {
		fMsgBox("Debe seleccionar el tipo de archivo.", "Validaci&oacute;n",
				"W");
		return;
	}
	var vIdeArc = "";
	if (document.getElementById("txtORTUplFil").value != "") {
		var vExt = document.getElementById("txtORTUplFil").value.substr(
				document.getElementById("txtORTUplFil").value.length - 4)
				.toUpperCase();
		var vTAr = dijit.byId("cboORT_AGR_TAR").get("value");
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
		// Ide_Arc
		if (vExt == ".PNG") {
			vIdeArc = "PNG_ARC_ADD";
		} else if (vExt == ".JPG") {
			vIdeArc = "JPG_ARC_ADD";
		} else if (vExt == ".PDF") {
			vIdeArc = "PDF_ARC_ADD";
		} else {
			vIdeArc = "OTR_ARC_ADD";
		}
	} else {
		fMsgBox("Debe seleccionar el archivo para agregar.",
				"Validaci&oacute;n", "W");
		return;
	}
	if (String(dijit.byId("txtORT_AGR_DES").get("value")).length == 0) {
		fMsgBox("Debe ingresar la descripci&oacute;n del archivo.",
				"Validaci&oacute;n", "W");
		return;
	} else if (!fValType("T", dijit.byId("txtORT_AGR_DES").get("value"))) {
		fMsgBox("La descripci&oacute;n tienen caracteres inv&aacute;lidos.",
				"Validaci&oacute;n", "W");
		return;
	}
	if (!fValType("T", dijit.byId("txtORT_AGR_OBS").get("value"))) {
		fMsgBox("Las observaciones tienen caracteres inv&aacute;lidos.",
				"Validaci&oacute;n", "W");
		return;
	}
	// Agregar
	document.getElementById("hORTUplHab").value = "S";

	document.frmORTUpload.action = fGetURLMVC("publishSvc.html?" + "cache="
			+ fGetCacheRnd() + "&proceso=RCO" + "&producto="
			+ document.getElementById("txtORT_RCO_NRO_OPE").producto
			+ "&operacion="
			+ document.getElementById("txtORT_RCO_NRO_OPE").operacion
			+ "&tipoArchivo=" + dijit.byId("cboORT_AGR_TAR").get("value")
			+ "&arcDesc="
			+ fEncodeURI(dijit.byId("txtORT_AGR_DES").get("value"))
			+ "&arcIde=" + vIdeArc + "&arcObserv="
			+ fEncodeURI(dijit.byId("txtORT_AGR_OBS").get("value")));
	document.frmORTUpload.submit();
}

function fORTArcUplRet() {
	if (document.getElementById("hORTUplHab").value == "S") {
		var vIfr = document.getElementById("ifrORTUpload");
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
					fMsgBox("Se ha producido un error. " + vRes.Code, "Error",
							"E");
				} else {
					dijit.byId("dlgORTUplBox").onCancel();
					fMsgBox("Archivo agregado con &eacute;xito!", "Exito", "O");
					fORTRCoDet();
				}
			}
		} catch (err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		}
		document.getElementById("hORTUplHab").value = "N";
	}
}

function fORTArcDel() {
	if (fSessionValidate().pSft) {
		fORTArcDelExec();
	}
}

function fORTArcDelExec() {
	// Validacion
	var vIdeArc = document.getElementById("txtORT_ARC_IDE_ARC").innerHTML;
	if (vIdeArc.substr(4, 7) != "ARC_ADD") {
		fMsgBox("No se puede eliminar un archivo" + "<br/>"
				+ "subido desde Seguros Online.", "Validaci&oacute;n", "W");
		return;
	}
	// Cargar
	document.getElementById("hORTEstFnc").value = "ADE";
	document.getElementById("ttrORTEstCod").style.display = "none";
	document.getElementById("ttrORTEstObs").style.display = "";
	dijit.byId("txtORT_EST_OBS").set("value", "");
	dijit.byId("dlgORTEstBox").set("title", "Eliminar archivo");
	dijit.byId("dlgORTEstBox").show();
}

function fORTArcDelDo() {
	// Validacion de datos
	if (String(dijit.byId("txtORT_EST_OBS").get("value")).length > 0) {
		if (!fValType("T", dijit.byId("txtORT_EST_OBS").get("value"))) {
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
		var vURL = fGetURLSvc("OperationService/delArchivoXRCo");
		var vPar = "cache=" + fGetCacheRnd() + "&producto="
				+ document.getElementById("txtORT_RCO_NRO_OPE").producto
				+ "&operacion="
				+ document.getElementById("txtORT_RCO_NRO_OPE").operacion
				+ "&archivo="
				+ document.getElementById("txtORT_ARC_TIP_ARC").archivo
				+ "&observaciones="
				+ fEncodeURI(dijit.byId("txtORT_EST_OBS").get("value"));
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
						dijit.byId('dlgORTEstBox').onCancel();
						fMsgBox("Archivo eliminado con &eacute;xito!", "Exito",
								"O");
						fORTArcCle();
						fORTRCoDet();
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

function fORTRCoDej() {
	if (fSessionValidate().pSft) {
		fORTRCoDejExec();
	}
}

function fORTRCoDejExec() {
	// ReadOnly
	document.getElementById("divORTRCo").style.display = "inline";
	document.getElementById("divORTArc").style.display = "none";
	fORTRCoCle();
	fORTArcROn(true);
	fORTArcCle();
	fORTRCoVol();
}

function fORTRCoEst() {
	var ssn = fSessionValidate();
	if (ssn.pSft) {
		fORTRCoEstExec(ssn.pSft, ssn.key, ssn.type);
	}
}

function fORTRCoEstExec(vPeopleSoft, vProfileKey, vProfileType) {
	if (document.getElementById("txtORT_RCO_DES_EST").estado == 3
			|| document.getElementById("txtORT_RCO_DES_EST").estado == 6) {
		fMsgBox(
				"La solicitud de Adhesi&oacute;n Web no se puede cambiar de estado.",
				"Validaci&oacute;n", "W");
		return;
	}
	if (vProfileKey != "E") {
		fMsgBox(
				"Su perfil no tiene permiso para realizar esta operaci&oacute;n.",
				"Validaci&oacute;n", "W");
		return;
	}
	fORTParEstCbo("cboORT_EST_COD", false);
	document.getElementById("hORTEstFnc").value = "EST";
	document.getElementById("ttrORTEstCod").style.display = "";
	document.getElementById("ttrORTEstObs").style.display = "";
	dijit.byId("txtORT_EST_OBS").set("value", "");
	dijit.byId("dlgORTEstBox").set("title", "Cambiar estado");
	dijit.byId("dlgORTEstBox").show();
}

function fORTEstAce() {
	switch (document.getElementById("hORTEstFnc").value) {
	case "ADE":
		fORTArcDelDo();
		break;
	case "EST":
		fORTRCoEstDo();
		break;
	default:
		// code block
	}
}

function fORTRCoEstDo() {
	// Validacion de datos
	var vEst = "0";
	var vEstD = "";
	if (dijit.byId("cboORT_EST_COD").get("value") == ""
			|| dijit.byId("cboORT_EST_COD").get("value") == "0") {
		fMsgBox("Debe seleccionar un estado.", "Validaci&oacute;n", "W");
		return;
	} else {
		vEst = dijit.byId("cboORT_EST_COD").get("value");
		vEstD = dijit.byId("cboORT_EST_COD").get("displayedValue");
	}
	if (String(dijit.byId("txtORT_EST_OBS").get("value")).length > 0) {
		if (!fValType("T", dijit.byId("txtORT_EST_OBS").get("value"))) {
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
		fQstBox(
				"Est&aacute; seguro que desea anular la solicitud de Adhesi&oacute;n Web?"
						+ "<br/>"
						+ "Esta operaci&oacute;n no podr&aacute; deshacerse.",
				"ORTEST", vEst, vEstD, dijit.byId("txtORT_EST_OBS")
						.get("value"));
	} else {
		fORTRCoSet(vEst, vEstD, dijit.byId("txtORT_EST_OBS").get("value"));
	}
}

function fORTRCoSet(vEstado, vEstadoDes, vObservaciones) {
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("OperationService/setRetCol");
		var vPar = "cache=" + fGetCacheRnd() + "&producto="
				+ document.getElementById("txtORT_RCO_NRO_OPE").producto
				+ "&operacion="
				+ document.getElementById("txtORT_RCO_NRO_OPE").operacion
				+ "&estado=" + vEstado + "&observaciones=" + vObservaciones;
		var deferred = request.post(vURL, {
			handleAs : "json",
			data : vPar,
			sync : true
		});
		deferred.then(function(response) {
			response = fJSONParse(response, 1);
			if (!!response) {
				if (response.REGS && response.REGS.REG
						&& response.REGS.REG[0].RES_MSG
						&& response.REGS.REG[0].RES_MSG == "OK") {
					dijit.byId('dlgORTEstBox').onCancel();
					fMsgBox("Cambio de estado exitoso!", "Exito", "O");
					// Poner valores
					fORTRCoSetVal(vEstado, vEstadoDes, vObservaciones);
					// Updatear Grilla
					dijit.byId("dgrORTRCoLis").update();
				} else {
					fMsgBox("Se ha producido un error.", "Error", "E");
				}
			} else {
				fMsgBox("Se ha producido un error.", "Error", "E");
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fORTRCoSetVal(vEstado, vEstadoDes, vObservaciones) {
	// Pantalla
	document.getElementById("txtORT_RCO_DES_EST").innerHTML = vEstadoDes;
	document.getElementById("txtORT_RCO_DES_EST").estado = vEstado;
	document.getElementById("txtORT_RCO_OBS_OPE").value = vObservaciones;
	// Deshabilitar botones si no es PENDIENTE
	if (vEstado != 5) {
		dijit.byId("btnORTRCoEst").set("disabled", true);
		dijit.byId("btnORTArcAdd").set("disabled", true);
		dijit.byId("btnORTArcDel").set("disabled", true);
		document.getElementById("txtORT_RCO_NRO_OPE").permiso = false;
	}
}

function fORTRCoExl() {
	if (fSessionValidate().pSft) {
		fORTRCoEstExec();
	}
}

function fORTRCoExlExec() {
	// Excel
	window.open(fGetURLMVC("dwlExcelRCoSvc.html?" + "cache=" + fGetCacheRnd()
			+ "&tipoExl=S" + fORTRCoConPar()), "excelArc",
			"resizable=yes,height=700,width=900,top=100,left=100");
}

function fORTRdTExl() {
	if (fSessionValidate().pSft) {
		fORTRdTExlExec();
	}
}

function fORTRdTExlExec() {
	// Producto
	if (dijit.byId("txtORT_CON_COD_PRO").get("value") == "") {
		fMsgBox(
				"Para obtener el reporte del tomador, tiene que buscar por producto.<br/>"
						+ "Haga clic en Volver, filtre por producto y luego podrá obtener este reporte.",
				"Validaci&oacute;n", "W");
		return false;
	}
	// Excel
	window.open(fGetURLMVC("dwlExcelRCoSvc.html?" + "cache=" + fGetCacheRnd()
			+ "&tipoExl=R" + fORTRCoConPar()), "excelArc",
			"resizable=yes,height=700,width=900,top=100,left=100");
}
