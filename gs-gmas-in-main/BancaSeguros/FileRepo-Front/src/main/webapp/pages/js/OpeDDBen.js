function onODBLoad() {
	// Inicializar
	fODBInit();
	fODBArcROn(true);
	// Defaults
	dijit.byId("cboODB_CON_COD_EST").set("value", 1);
	dijit.byId("chkODB_CON_FEC_ING").set("checked", true);
	// Fin
	fMnuDeselect();
}

function fODBInit() {
	// Resize
	fBrowserResize();
	// Ancho de botones
	dojo.style("btnODBDBeCon", "width", "150px");
	dojo.style("btnODBDBeLim", "width", "100px");
	dojo.style("btnODBDBeDet", "width", "120px");
	dojo.style("btnODBDBeVol", "width", "120px");
	dojo.style("btnODBDBeDej", "width", "100px");
	dojo.style("btnODBArcVie", "width", "100px");
	dojo.style("btnODBArcAdd", "width", "120px");
	dojo.style("btnODBArcDel", "width", "120px");
	dojo.style("btnODBDBeEst", "width", "100px");
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
				fODBParFecHoy(response.result);
			}
		});
	});
	// Estados
	fODBParEstCbo("cboODB_CON_COD_EST", true);
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
					fODBParTDoCbo(response);
				}
			}
		});
	});
}

function fODBParFecHoy(vRes) {
	document.getElementById("hidODBFecHoy").value = vRes;
}

function fODBParEstCbo(vCbo, vNuevo) {
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
	oOpt.label = "VERIFICADO";
	oOpt.value = "3";
	oCbo.addOption(oOpt);
	oOpt = {};
	oOpt.label = "ANULADO";
	oOpt.value = "6";
	oCbo.addOption(oOpt);
}

function fODBParTDoCbo(vRes) {
	fComboClean("cboODB_CON_ASE_TDO");
	fComboClean("cboODB_CON_TOM_TDO");
	var oCboA = dijit.byId("cboODB_CON_ASE_TDO");
	var oCboT = dijit.byId("cboODB_CON_TOM_TDO");
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

function fODBDBeEstOtr() {
	dijit.byId("cboODB_CON_COD_OTR").set("value", "0");
	document.getElementById("spaODB_CON_OTR").style.display = "none";
	if (dijit.byId("cboODB_CON_COD_EST").get("value") != "0") {
		if (dijit.byId("cboODB_CON_COD_EST").get("value").split("|")[1] == "CBO_MOT") {
			document.getElementById("spaODB_CON_OTR").style.display = "inline";
		}
	}
}

function fODBDBeCle() {
	// Datos
	document.getElementById("txtODB_DBE_NRO_OPE").innerHTML = "";
	document.getElementById("txtODB_DBE_NRO_OPE").cntArch = 0;
	document.getElementById("txtODB_DBE_NRO_OPE").producto = "";
	document.getElementById("txtODB_DBE_NRO_OPE").operacion = "";
	document.getElementById("txtODB_DBE_NRO_OPE").permiso = false;
	document.getElementById("txtODB_DBE_FEC_ING").innerHTML = "";
	document.getElementById("txtODB_DBE_NRO_POL").innerHTML = "";
	document.getElementById("txtODB_DBE_ASE_DBE").innerHTML = "";
	document.getElementById("txtODB_DBE_DES_EST").innerHTML = "";
	document.getElementById("txtODB_DBE_DES_EST").estado = "";
	document.getElementById("txtODB_DBE_UMA_FEC").innerHTML = "";
	document.getElementById("txtODB_DBE_UMA_USU").innerHTML = "";
	dijit.byId("txtODB_DBE_OBS_OPE").set("value", "");
	// Tree
	if (dijit.byId("treODBArc") != null) {
		fDestroyElement("treODBArc");
		document.getElementById("tdODBArc").innerHTML = '<div id="_divODBArc" style="width: 400px; height: 500px;"></div>';
	}
}

function fODBArcROn(value) {
	// Botones
	dijit.byId("btnODBArcVie").set("disabled", value);
	if (document.getElementById("txtODB_DBE_NRO_OPE").permiso) {
		dijit.byId("btnODBArcDel").set("disabled", value);
	}
}

function fODBArcCle() {
	// Datos
	document.getElementById("txtODB_ARC_DES_ARC").innerHTML = "";
	document.getElementById("txtODB_ARC_TIP_ARC").innerHTML = "";
	document.getElementById("txtODB_ARC_TIP_ARC").archivo = "";
	document.getElementById("txtODB_ARC_TIP_ARC").estArch = "";
	document.getElementById("txtODB_ARC_UIN_FEC").innerHTML = "";
	document.getElementById("txtODB_ARC_UIN_USU").innerHTML = "";
	document.getElementById("txtODB_ARC_IDE_ARC").innerHTML = "";
	dijit.byId("txtODB_ARC_OBS_ARC").set("value", "");
}

function fODBConFInChk() {
	if (dijit.byId("chkODB_CON_FEC_ING").get("checked")) {
		dijit.byId("dtxODB_CON_FEC_IND").set("disabled", false);
		dijit.byId("dtxODB_CON_FEC_INH").set("disabled", false);
		dijit.byId("dtxODB_CON_FEC_IND").set(
				"value",
				fFormatDTB(fDateAdd(
						document.getElementById("hidODBFecHoy").value, -7)));
		dijit.byId("dtxODB_CON_FEC_INH").set("value",
				fFormatDTB(document.getElementById("hidODBFecHoy").value));
	} else {
		dijit.byId("dtxODB_CON_FEC_IND").set("disabled", true);
		dijit.byId("dtxODB_CON_FEC_INH").set("disabled", true);
		dijit.byId("dtxODB_CON_FEC_IND").set("value", null);
		dijit.byId("dtxODB_CON_FEC_INH").set("value", null);
	}
}

function fODBConFMaChk() {
	if (dijit.byId("chkODB_CON_FEC_MAN").get("checked")) {
		dijit.byId("dtxODB_CON_FEC_MAD").set("disabled", false);
		dijit.byId("dtxODB_CON_FEC_MAH").set("disabled", false);
		dijit.byId("dtxODB_CON_FEC_MAD").set(
				"value",
				fFormatDTB(fDateAdd(
						document.getElementById("hidODBFecHoy").value, -7)));

		dijit.byId("dtxODB_CON_FEC_MAH").set("value",
				fFormatDTB(document.getElementById("hidODBFecHoy").value));
	} else {
		dijit.byId("dtxODB_CON_FEC_MAD").set("disabled", true);
		dijit.byId("dtxODB_CON_FEC_MAH").set("disabled", true);
		dijit.byId("dtxODB_CON_FEC_MAD").set("value", null);
		dijit.byId("dtxODB_CON_FEC_MAH").set("value", null);
	}
}

function fODBDBeCon() {
	if (fSessionValidate().pSft) {
		fODBDBeConExec();
	}
}

function fODBDBeConExec() {
	// Validar
	if (!fODBDBeConVal()) {
		return;
	}
	// Limpiar
	fGridTltDisconnect();
	// Consulta
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("OperationService/getDBeFiltroList?cache="
				+ fGetCacheRnd() + fODBDBeConPar());
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
					name : "Ope.",
					field : "NRO_OPE",
					width : "30px"
				}, {
					name : "Prod.",
					field : "COD_PRO",
					width : "35px"
				}, {
					name : "P&oacute;liza",
					field : "NRO_POL",
					width : "145px"
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
					field : "DES_EST",
					width : "70px"
				}, {
					name : "Fecha de Estado",
					field : "UMA_FEC",
					width : "105px"
				}, {
					name : "&Uacute;ltimo Usuario",
					fields : [ "UMA_COD", "UMA_APE", "UMA_NOM", "OBS_OPE" ],
					formatter : fDgrColMlT,
					width : "120px"
				} ] ];

				if (dijit.byId("dgrODBDBeLis") == null) {
					oGrid = new DataGrid({
						id : "dgrODBDBeLis",
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
					}, "_divODBDBeLis");

					oGrid.startup();
				} else {
					dijit.byId("dgrODBDBeLis").setStructure(layout);
					dijit.byId("dgrODBDBeLis").setStore(jsonDataSource);
				}
				// Botones y paneles
				document.getElementById("divODBFil").style.display = "none";
				document.getElementById("divODBDBe").style.display = "inline";
				fODBDBeCle();
				fODBArcCle();
				dijit.byId("dgrODBDBeLis").update();
				document.getElementById("hTltExec").value = "S";
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fODBDBeConVal() {
	// Nro. Operacion
	if (dijit.byId("txtODB_CON_NRO_OPE").get("value") == undefined) {
		fMsgBox("N&uacute;mero de Operaci&oacute;n:<br/>"
				+ "Debe ingresar un valor num&eacute;rico.",
				"Validaci&oacute;n", "W");
		return false;
	}
	// Fecha de Ingreso
	if (dijit.byId("chkODB_CON_FEC_ING").get("checked")) {
		if (dijit.byId("dtxODB_CON_FEC_IND").get("value") == null) {
			fMsgBox("Fecha de Ingreso:<br/>" + "Desde inv&aacute;lido.",
					"Validaci&oacute;n", "W");
			return false;
		}
		if (dijit.byId("dtxODB_CON_FEC_INH").get("value") == null) {
			fMsgBox("Fecha de Ingreso:<br/>" + "Hasta inv&aacute;lido.",
					"Validaci&oacute;n", "W");
			return false;
		}
		// Obtengo las fechas
		var vFInDes = dojo.date.locale.format(dijit.byId("dtxODB_CON_FEC_IND")
				.get("value"), {
			datePattern : "yyyyMMdd",
			selector : "date"
		});
		var vFInHas = dojo.date.locale.format(dijit.byId("dtxODB_CON_FEC_INH")
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
		if (vFInHas > document.getElementById("hidODBFecHoy").value) {
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
	if (dijit.byId("chkODB_CON_FEC_MAN").get("checked")) {
		if (dijit.byId("dtxODB_CON_FEC_MAD").get("value") == null) {
			fMsgBox("Fecha de Actualizaci&oacute;n:<br/>"
					+ "Desde inv&aacute;lido.", "Validaci&oacute;n", "W");
			return false;
		}
		if (dijit.byId("dtxODB_CON_FEC_MAH").get("value") == null) {
			fMsgBox("Fecha de Actualizaci&oacute;n:<br/>"
					+ "Hasta inv&aacute;lido.", "Validaci&oacute;n", "W");
			return false;
		}
		// Obtengo las fechas
		var vFMaDes = dojo.date.locale.format(dijit.byId("dtxODB_CON_FEC_MAD")
				.get("value"), {
			datePattern : "yyyyMMdd",
			selector : "date"
		});
		var vFMaHas = dojo.date.locale.format(dijit.byId("dtxODB_CON_FEC_MAH")
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
		if (vFMaHas > document.getElementById("hidODBFecHoy").value) {
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
	if (dijit.byId("txtODB_CON_ASE_NDO").get("value") == undefined) {
		fMsgBox("N&uacute;mero de Documento:<br/>"
				+ "Debe ingresar un valor num&eacute;rico.",
				"Validaci&oacute;n", "W");
		return false;
	}
	// Apellido y Nombre
	if (dijit.byId("txtODB_CON_ASE_APE").get("value") != "") {
		if (dijit.byId("txtODB_CON_ASE_APE").get("value").length < 4) {
			fMsgBox("Apellido del asegurado:<br/>"
					+ "Debe ingresar al menos 4 caracteres.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	if (dijit.byId("txtODB_CON_ASE_NOM").get("value") != "") {
		if (dijit.byId("txtODB_CON_ASE_NOM").get("value").length < 4) {
			fMsgBox("Nombre del asegurado:<br/>"
					+ "Debe ingresar al menos 4 caracteres.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	// Nro. Documento
	if (dijit.byId("txtODB_CON_TOM_NDO").get("value") == undefined) {
		fMsgBox("N&uacute;mero de Documento:<br/>"
				+ "Debe ingresar un valor num&eacute;rico.",
				"Validaci&oacute;n", "W");
		return false;
	}
	// Apellido y Nombre
	if (dijit.byId("txtODB_CON_TOM_APE").get("value") != "") {
		if (dijit.byId("txtODB_CON_TOM_APE").get("value").length < 4) {
			fMsgBox("Apellido del tomador:<br/>"
					+ "Debe ingresar al menos 4 caracteres.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	if (dijit.byId("txtODB_CON_TOM_NOM").get("value") != "") {
		if (dijit.byId("txtODB_CON_TOM_NOM").get("value").length < 4) {
			fMsgBox("Nombre del tomador:<br/>"
					+ "Debe ingresar al menos 4 caracteres.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	// Verificar que se selecciono algun filtro
	if (isNaN(dijit.byId("txtODB_CON_NRO_OPE").get("value"))
			&& dijit.byId("txtODB_CON_COD_PRO").get("value") == ""
			&& dijit.byId("txtODB_CON_NRO_POL").get("value") == ""
			&& dijit.byId("cboODB_CON_COD_EST").get("value") == "0"
			&& dijit.byId("chkODB_CON_FEC_ING").get("checked") == false
			&& dijit.byId("chkODB_CON_FEC_MAN").get("checked") == false
			&& dijit.byId("cboODB_CON_ASE_TDO").get("value") == "0"
			&& isNaN(dijit.byId("txtODB_CON_ASE_NDO").get("value"))
			&& dijit.byId("txtODB_CON_ASE_APE").get("value") == ""
			&& dijit.byId("txtODB_CON_ASE_NOM").get("value") == ""
			&& dijit.byId("cboODB_CON_TOM_TDO").get("value") == "0"
			&& isNaN(dijit.byId("txtODB_CON_TOM_NDO").get("value"))
			&& dijit.byId("txtODB_CON_TOM_APE").get("value") == ""
			&& dijit.byId("txtODB_CON_TOM_NOM").get("value") == "") {
		fMsgBox("Debe seleccionar al menos un filtro de b&uacute;squeda.",
				"Validaci&oacute;n", "W");
		return false;
	}
	return true;
}

function fODBDBeConPar() {
	var vPar = "";
	if (!isNaN(dijit.byId("txtODB_CON_NRO_OPE").get("value"))) {
		vPar += "&operacion=" + dijit.byId("txtODB_CON_NRO_OPE").get("value");
	} else {
		vPar += "&operacion=0";
	}
	vPar += "&producto=" + dijit.byId("txtODB_CON_COD_PRO").get("value");
	vPar += "&poliza=" + dijit.byId("txtODB_CON_NRO_POL").get("value");
	vPar += "&estado=" + dijit.byId("cboODB_CON_COD_EST").get("value");
	// Obtengo las fechas
	var vFInDes = 20180101;
	var vFInHas = 21000101;
	if (dijit.byId("chkODB_CON_FEC_ING").get("checked")) {
		if (dijit.byId("dtxODB_CON_FEC_IND").get("value") != null) {
			vFInDes = dojo.date.locale.format(dijit.byId("dtxODB_CON_FEC_IND")
					.get("value"), {
				datePattern : "yyyyMMdd",
				selector : "date"
			});
		}
		if (dijit.byId("dtxODB_CON_FEC_INH").get("value") != null) {
			vFInHas = dojo.date.locale.format(dijit.byId("dtxODB_CON_FEC_INH")
					.get("value"), {
				datePattern : "yyyyMMdd",
				selector : "date"
			});
		}
	}
	var vFMaDes = 20180101;
	var vFMaHas = 21000101;
	if (dijit.byId("chkODB_CON_FEC_MAN").get("checked")) {
		if (dijit.byId("dtxODB_CON_FEC_MAD").get("value") != null) {
			vFMaDes = dojo.date.locale.format(dijit.byId("dtxODB_CON_FEC_MAD")
					.get("value"), {
				datePattern : "yyyyMMdd",
				selector : "date"
			});
		}
		if (dijit.byId("dtxODB_CON_FEC_MAH").get("value") != null) {
			vFMaHas = dojo.date.locale.format(dijit.byId("dtxODB_CON_FEC_MAH")
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
	vPar += "&asegTipDoc=" + dijit.byId("cboODB_CON_ASE_TDO").get("value");
	if (!isNaN(dijit.byId("txtODB_CON_ASE_NDO").get("value"))) {
		vPar += "&asegNroDoc=" + dijit.byId("txtODB_CON_ASE_NDO").get("value");
	} else {
		vPar += "&asegNroDoc=";
	}
	vPar += "&asegApellido=" + dijit.byId("txtODB_CON_ASE_APE").get("value");
	vPar += "&asegNombre=" + dijit.byId("txtODB_CON_ASE_NOM").get("value");
	vPar += "&tomaTipDoc=" + dijit.byId("cboODB_CON_TOM_TDO").get("value");
	if (!isNaN(dijit.byId("txtODB_CON_TOM_NDO").get("value"))) {
		vPar += "&tomaNroDoc=" + dijit.byId("txtODB_CON_TOM_NDO").get("value");
	} else {
		vPar += "&tomaNroDoc=";
	}
	vPar += "&tomaApellido=" + dijit.byId("txtODB_CON_TOM_APE").get("value");
	vPar += "&tomaNombre=" + dijit.byId("txtODB_CON_TOM_NOM").get("value");
	return vPar;
}

function fODBDBeLim() {
	dijit.byId("txtODB_CON_NRO_OPE").set("value", "");
	dijit.byId("txtODB_CON_COD_PRO").set("value", "");
	dijit.byId("txtODB_CON_NRO_POL").set("value", "");
	dijit.byId("cboODB_CON_COD_EST").set("value", "0");
	dijit.byId("chkODB_CON_FEC_ING").set("checked", false);
	dijit.byId("chkODB_CON_FEC_MAN").set("checked", false);
	dijit.byId("cboODB_CON_ASE_TDO").set("value", "0");
	dijit.byId("txtODB_CON_ASE_NDO").set("value", "");
	dijit.byId("txtODB_CON_ASE_APE").set("value", "");
	dijit.byId("txtODB_CON_ASE_NOM").set("value", "");
	dijit.byId("cboODB_CON_TOM_TDO").set("value", "0");
	dijit.byId("txtODB_CON_TOM_NDO").set("value", "");
	dijit.byId("txtODB_CON_TOM_APE").set("value", "");
	dijit.byId("txtODB_CON_TOM_NOM").set("value", "");
	// Defaults
	dijit.byId("cboODB_CON_COD_EST").set("value", 1);
	dijit.byId("chkODB_CON_FEC_ING").set("checked", true);
}

function fODBDBeVol() {
	if (fSessionValidate().pSft) {
		fODBDBeVolExec();
	}
}

function fODBDBeVolExec() {
	document.getElementById("divODBFil").style.display = "inline";
	document.getElementById("divODBDBe").style.display = "none";
	fODBDBeCle();
	fODBArcROn(true);
	fODBArcCle();
}

function fODBDBeDet() {
	var ssn = fSessionValidate();
	if (ssn.pSft) {
		fODBDBeDetExec(ssn.pSft, ssn.key, ssn.type);
	}
}

function fODBDBeDetExec(vPeopleSoft, vProfileKey, vProfileType) {
	var oGrid = dijit.byId("dgrODBDBeLis");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar una operaci&oacute;n.", "Advertencia", "W");
		return;
	}
	// Ver Operacion
	require([ "dojo/request", "dijit/Tree", "dojo/data/ItemFileWriteStore",
			"dojo/data/ItemFileReadStore", "dijit/tree/ForestStoreModel",
			"dojo/domReady!" ], function(request, Tree, ItemFileWriteStore,
			ItemFileReadStore, ForestStoreModel) {
		var vURL = fGetURLSvc("OperationService/getArchivoXDBeList?cache="
				+ fGetCacheRnd() + "&operacion=" + oItems[0].NRO_OPE[0]
				+ "&archivo=0");
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
				var vArcTre = fODBDBeTomArc(vJSON);
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
				fODBDBeCle();
				fODBDBeTomTre(vTreeModel);
				// Botones y paneles
				document.getElementById("divODBDBe").style.display = "none";
				document.getElementById("divODBArc").style.display = "inline";
				// Datos
				fODBDBeTomDat(oItems[0], vProfileKey);
				fODBDBeGrant();
				fODBArcROn(true);
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fODBDBeTomArc(vJSON) {
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
		label : '<b>ARCHIVO DE LA D.D.BENEF.</b>',
		id : "1",
		tipo : "GDO",
		children : vArcDoc
	});
	vArcDoc = [];
	// Retorno
	return vArcTre;
}

function fODBDBeTomTre(vTreeModel) {
	if (dijit.byId("treODBArc") == null) {
		oTree = dijit.Tree({
			id : "treODBArc",
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
				fODBArcDat(item);
			},
			onDblClick : function(item) {
				fODBArcVie();
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
		}, "_divODBArc");

		oTree.startup();
	}
}

function fODBDBeTomDat(vItem, vProfileKey) {
	// Cargar Datos
	document.getElementById("txtODB_DBE_NRO_OPE").innerHTML = vItem.COD_PRO[0]
			+ " " + vItem.NRO_OPE[0];
	document.getElementById("txtODB_DBE_NRO_OPE").producto = vItem.COD_PRO[0];
	document.getElementById("txtODB_DBE_NRO_OPE").operacion = vItem.NRO_OPE[0];
	document.getElementById("txtODB_DBE_NRO_OPE").permiso = (vProfileKey != "S" ? false
			: true);
	document.getElementById("txtODB_DBE_FEC_ING").innerHTML = vItem.FEC_ING[0];
	document.getElementById("txtODB_DBE_NRO_POL").innerHTML = vItem.NRO_POL[0];
	document.getElementById("txtODB_DBE_ASE_DBE").innerHTML = vItem.ASE_TDD[0]
			+ " " + vItem.ASE_NDO[0] + " " + vItem.ASE_APE[0] + " "
			+ vItem.ASE_NOM[0];
	document.getElementById("txtODB_DBE_TOM_DBE").innerHTML = vItem.TOM_TDD[0]
			+ " " + vItem.TOM_NDO[0] + " " + vItem.TOM_APE[0] + " "
			+ vItem.TOM_NOM[0];
	document.getElementById("txtODB_DBE_DES_EST").innerHTML = vItem.DES_EST[0];
	document.getElementById("txtODB_DBE_DES_EST").estado = vItem.COD_EST[0];
	document.getElementById("txtODB_DBE_UMA_FEC").innerHTML = vItem.UMA_FEC[0];
	document.getElementById("txtODB_DBE_UMA_USU").innerHTML = vItem.UMA_COD[0]
			+ " " + vItem.UMA_APE[0] + " " + vItem.UMA_NOM[0];
	dijit.byId("txtODB_DBE_OBS_OPE").set("value", vItem.OBS_OPE[0]);
}

function fODBDBeGrant() {
	// Botones
	if (document.getElementById("txtODB_DBE_DES_EST").estado != 1) {
		dijit.byId("btnODBDBeEst").set("disabled", true);
		dijit.byId("btnODBArcAdd").set("disabled", true);
		dijit.byId("btnODBArcDel").set("disabled", true);
		document.getElementById("txtODB_DBE_NRO_OPE").permiso = false;
	} else if (!document.getElementById("txtODB_DBE_NRO_OPE").permiso) {
		dijit.byId("btnODBDBeEst").set("disabled", true);
		dijit.byId("btnODBArcAdd").set("disabled", true);
		dijit.byId("btnODBArcDel").set("disabled", true);
	} else {
		dijit.byId("btnODBDBeEst").set("disabled", false);
		dijit.byId("btnODBArcAdd").set("disabled", false);
	}
}

function fODBArcDat(vItem) {
	if (vItem.NRO_ARC != undefined) {
		// Paneles
		fODBArcCle();
		fODBArcROn(false);
		// Datos
		document.getElementById("txtODB_ARC_DES_ARC").innerHTML = vItem.DES_ARC[0];
		document.getElementById("txtODB_ARC_TIP_ARC").innerHTML = vItem.TIP_ARC[0];
		document.getElementById("txtODB_ARC_TIP_ARC").archivo = vItem.NRO_ARC[0];
		document.getElementById("txtODB_ARC_TIP_ARC").estArch = vItem.EST_ARC[0];
		document.getElementById("txtODB_ARC_UIN_FEC").innerHTML = vItem.UIN_FEC[0];
		document.getElementById("txtODB_ARC_UIN_USU").innerHTML = vItem.UIN_COD[0]
				+ " " + vItem.UIN_APE[0] + " " + vItem.UIN_NOM[0];
		document.getElementById("txtODB_ARC_IDE_ARC").innerHTML = vItem.IDE_ARC[0];
		dijit.byId("txtODB_ARC_OBS_ARC").set("value", vItem.OBS_ARC[0]);
	} else {
		fODBArcROn(true);
		fODBArcCle();
	}
}

function fODBArcVie() {
	if (fSessionValidate().pSft) {
		fODBArcVieExec();
	}
}

function fODBArcVieExec(vItem) {
	// Visualizacion
	if (!dijit.byId("btnODBArcVie").get("disabled")) {
		if (document.getElementById("txtODB_ARC_TIP_ARC").estArch == "0") {
			document.getElementById("txtODB_DBE_NRO_OPE").cntArch++;
			var vNRO_ARC = document.getElementById("txtODB_ARC_TIP_ARC").archivo;
			var vTIP_ARC = document.getElementById("txtODB_ARC_TIP_ARC").innerHTML;
			var vCNT_ARC = document.getElementById("txtODB_DBE_NRO_OPE").cntArch;
			if (vCNT_ARC > 10) {
				document.getElementById("txtODB_DBE_NRO_OPE").cntArch = 0;
			}
			window.open(fGetURLMVC("downloadSvc.html?" + "cache="
					+ fGetCacheRnd() + "&proceso=DBE" + "&archivo=" + vNRO_ARC
					+ "&tipoArchivo=" + vTIP_ARC), "viewArc" + vNRO_ARC,
					"resizable=yes,height=700,width=900,top="
							+ String(90 + (vCNT_ARC * 10)) + ",left="
							+ String(90 + (vCNT_ARC * 10)));
		} else if (document.getElementById("txtODB_ARC_TIP_ARC").estArch == "2") {
			fMsgBox("El archivo fue depurado en proceso autom&aacute;tico.",
					"Advertencia", "W");
		} else if (document.getElementById("txtODB_ARC_TIP_ARC").estArch == "3") {
			fMsgBox("El archivo fue enviado a FileNet.", "Advertencia", "W");
		} else {
			fMsgBox("Se produjo un error al leer el archivo.", "Error", "E");
		}
	}
}

function fODBArcAdd() {
	if (fSessionValidate().pSft) {
		fODBArcAddExec();
	}
}

function fODBArcAddExec() {
	// Limpiar y cargar
	document.frmODBUpload.reset();
	dijit.byId("cboODB_AGR_TAR").set("value", "");
	dijit.byId("txtODB_AGR_DES").set("value", "");
	dijit.byId("txtODB_AGR_IDE").set("value", "");
	dijit.byId("txtODB_AGR_OBS").set("value", "");
	dijit.byId("dlgODBUplBox").show();
}

function fODBArcUpl() {
	if (fSessionValidate().pSft) {
		fODBArcUplExec();
	}
}

function fODBArcUplExec() {
	// Validacion de datos
	if (dijit.byId("cboODB_AGR_TAR").get("value") == "") {
		fMsgBox("Debe seleccionar el tipo de archivo.", "Validaci&oacute;n",
				"W");
		return;
	}
	var vIdeArc = "";
	if (document.getElementById("txtODBUplFil").value != "") {
		var vExt = document.getElementById("txtODBUplFil").value.substr(
				document.getElementById("txtODBUplFil").value.length - 4)
				.toUpperCase();
		var vTAr = dijit.byId("cboODB_AGR_TAR").get("value");
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
	if (String(dijit.byId("txtODB_AGR_DES").get("value")).length == 0) {
		fMsgBox("Debe ingresar la descripci&oacute;n del archivo.",
				"Validaci&oacute;n", "W");
		return;
	} else if (!fValType("T", dijit.byId("txtODB_AGR_DES").get("value"))) {
		fMsgBox("La descripci&oacute;n tienen caracteres inv&aacute;lidos.",
				"Validaci&oacute;n", "W");
		return;
	}
	if (!fValType("T", dijit.byId("txtODB_AGR_OBS").get("value"))) {
		fMsgBox("Las observaciones tienen caracteres inv&aacute;lidos.",
				"Validaci&oacute;n", "W");
		return;
	}
	// Agregar
	document.getElementById("hODBUplHab").value = "S";

	document.frmODBUpload.action = fGetURLMVC("publishSvc.html?" + "cache="
			+ fGetCacheRnd() + "&proceso=DBE" + "&operacion="
			+ document.getElementById("txtODB_DBE_NRO_OPE").operacion
			+ "&tipoArchivo=" + dijit.byId("cboODB_AGR_TAR").get("value")
			+ "&arcDesc="
			+ fEncodeURI(dijit.byId("txtODB_AGR_DES").get("value"))
			+ "&arcIde=" + vIdeArc + "&arcObserv="
			+ fEncodeURI(dijit.byId("txtODB_AGR_OBS").get("value")));
	document.frmODBUpload.submit();
}

function fODBArcUplRet() {
	if (document.getElementById("hODBUplHab").value == "S") {
		var vIfr = document.getElementById("ifrODBUpload");
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
					dijit.byId("dlgODBUplBox").onCancel();
					fMsgBox("Archivo agregado con &eacute;xito!", "Exito", "O");
					fODBDBeDet();
				}
			}
		} catch (err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		}
		document.getElementById("hODBUplHab").value = "N";
	}
}

function fODBArcDel() {
	if (fSessionValidate().pSft) {
		fODBArcDelExec();
	}
}

function fODBArcDelExec() {
	// Validacion
	var vIdeArc = document.getElementById("txtODB_ARC_IDE_ARC").innerHTML;
	if (vIdeArc.substr(4, 7) != "ARC_ADD") {
		fMsgBox("No se puede eliminar un archivo" + "<br/>"
				+ "subido desde Seguros Online.", "Validaci&oacute;n", "W");
		return;
	}
	// Cargar
	document.getElementById("hODBEstFnc").value = "ADE";
	document.getElementById("ttrODBEstCod").style.display = "none";
	document.getElementById("ttrODBEstObs").style.display = "";
	dijit.byId("txtODB_EST_OBS").set("value", "");
	dijit.byId("dlgODBEstBox").set("title", "Eliminar archivo");
	dijit.byId("dlgODBEstBox").show();
}

function fODBArcDelDo() {
	// Validacion de datos
	if (String(dijit.byId("txtODB_EST_OBS").get("value")).length > 0) {
		if (!fValType("T", dijit.byId("txtODB_EST_OBS").get("value"))) {
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
		var vURL = fGetURLSvc("OperationService/delArchivoXDBe");
		var vPar = "cache=" + fGetCacheRnd() + "&operacion="
				+ document.getElementById("txtODB_DBE_NRO_OPE").operacion
				+ "&archivo="
				+ document.getElementById("txtODB_ARC_TIP_ARC").archivo
				+ "&observaciones="
				+ fEncodeURI(dijit.byId("txtODB_EST_OBS").get("value"));
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
						dijit.byId('dlgODBEstBox').onCancel();
						fMsgBox("Archivo eliminado con &eacute;xito!", "Exito",
								"O");
						fODBArcCle();
						fODBDBeDet();
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

function fODBDBeDej() {
	if (fSessionValidate().pSft) {
		fODBDBeDejExec();
	}
}

function fODBDBeDejExec() {
	// ReadOnly
	document.getElementById("divODBDBe").style.display = "inline";
	document.getElementById("divODBArc").style.display = "none";
	fODBDBeCle();
	fODBArcROn(true);
	fODBArcCle();
	fODBDBeVol();
}

function fODBDBeEst() {
	var ssn = fSessionValidate();
	if (ssn.pSft) {
		fODBDBeEstExec(ssn.pSft, ssn.key, ssn.type);
	}
}

function fODBDBeEstExec(vPeopleSoft, vProfileKey, vProfileType) {
	if (document.getElementById("txtODB_DBE_DES_EST").estado != 1) {
		fMsgBox("La D.D.Benef. no se puede cambiar de estado.",
				"Validaci&oacute;n", "W");
		return;
	}
	if (vProfileKey != "S") {
		fMsgBox(
				"Su perfil no tiene permiso para realizar esta operaci&oacute;n.",
				"Validaci&oacute;n", "W");
		return;
	}
	fODBParEstCbo("cboODB_EST_COD", false);
	document.getElementById("hODBEstFnc").value = "EST";
	document.getElementById("ttrODBEstCod").style.display = "";
	document.getElementById("ttrODBEstObs").style.display = "";
	dijit.byId("txtODB_EST_OBS").set("value", "");
	dijit.byId("dlgODBEstBox").set("title", "Cambiar estado");
	dijit.byId("dlgODBEstBox").show();
}

function fODBEstAce() {
	switch (document.getElementById("hODBEstFnc").value) {
	case "ADE":
		fODBArcDelDo();
		break;
	case "EST":
		fODBDBeEstDo();
		break;
	default:
		// code block
	}
}

function fODBDBeEstDo() {
	// Validacion de datos
	var vEst = "0";
	var vEstD = "";
	if (dijit.byId("cboODB_EST_COD").get("value") == ""
			|| dijit.byId("cboODB_EST_COD").get("value") == "0") {
		fMsgBox("Debe seleccionar un estado.", "Validaci&oacute;n", "W");
		return;
	} else {
		vEst = dijit.byId("cboODB_EST_COD").get("value");
		vEstD = dijit.byId("cboODB_EST_COD").get("displayedValue");
	}
	if (vEst == "1") {
		fMsgBox("La D.D.Benef. no se puede cambiar a ese estado.",
				"Validaci&oacute;n", "W");
		return;
	}
	if (String(dijit.byId("txtODB_EST_OBS").get("value")).length > 0) {
		if (!fValType("T", dijit.byId("txtODB_EST_OBS").get("value"))) {
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
		fQstBox("Est&aacute; seguro que desea anular la D.D.Benef.?" + "<br/>"
				+ "Esta operaci&oacute;n no podr&aacute; deshacerse.",
				"ODBEST", vEst, vEstD, dijit.byId("txtODB_EST_OBS")
						.get("value"));
	} else {
		fODBDBeSet(vEst, vEstD, dijit.byId("txtODB_EST_OBS").get("value"));
	}
}

function fODBDBeSet(vEstado, vEstadoDes, vObservaciones) {
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("OperationService/setDDBenef");
		var vPar = "cache=" + fGetCacheRnd() + "&operacion="
				+ document.getElementById("txtODB_DBE_NRO_OPE").operacion
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
					dijit.byId('dlgODBEstBox').onCancel();
					fMsgBox("Cambio de estado exitoso!", "Exito", "O");
					// Poner valores
					fODBDBeSetVal(vEstado, vEstadoDes, vObservaciones);
					// Updatear Grilla
					dijit.byId("dgrODBDBeLis").update();
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

function fODBDBeSetVal(vEstado, vEstadoDes, vObservaciones) {
	// Pantalla
	document.getElementById("txtODB_DBE_DES_EST").innerHTML = vEstadoDes;
	document.getElementById("txtODB_DBE_DES_EST").estado = vEstado;
	document.getElementById("txtODB_DBE_OBS_OPE").value = vObservaciones;
	// Deshabilitar botones
	dijit.byId("btnODBDBeEst").set("disabled", true);
	dijit.byId("btnODBArcAdd").set("disabled", true);
	dijit.byId("btnODBArcDel").set("disabled", true);
	document.getElementById("txtODB_DBE_NRO_OPE").permiso = false;
}

function fODBDBeExl() {
	if (fSessionValidate().pSft) {
		fODBDBeExlExec();
	}
}

function fODBDBeExlExec() {
	// Excel
	window.open(fGetURLMVC("dwlExcelDBeSvc.html?" + "cache=" + fGetCacheRnd()
			+ fODBDBeConPar()), "excelArc",
			"resizable=yes,height=700,width=900,top=100,left=100");
}