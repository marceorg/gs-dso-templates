function onOSILoad() {
	// Inicializar
	fOSIInit();
	fOSIArcROn(true);
	// Defaults
	dijit.byId("cboOSI_CON_COD_EST").set("value", 1);
	// Fin
	fMnuDeselect();
}

function fOSIInit() {
	// Resize
	fBrowserResize();
	// Ancho de botones
	dojo.style("btnOSISinCon", "width", "150px");
	dojo.style("btnOSISinLim", "width", "100px");
	dojo.style("btnOSISinDet", "width", "120px");
	dojo.style("btnOSISinVol", "width", "120px");
	dojo.style("btnOSISinDej", "width", "100px");
	dojo.style("btnOSIArcCon", "width", "150px");
	dojo.style("btnOSIArcVie", "width", "100px");
	dojo.style("btnOSIArcAdd", "width", "120px");
	dojo.style("btnOSIArcDel", "width", "120px");
	dojo.style("btnOSIArcUpd", "width", "120px");
	dojo.style("btnOSISinEst", "width", "100px");
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
				fOSIParFecHoy(response.result);
			}
		});
	});
	// Estados
	fOSIParEstCbo("cboOSI_CON_COD_EST", 0);
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
					fOSIParTDoCbo(response);
				}
			}
		});
	});
}

function fOSIParFecHoy(vRes) {
	document.getElementById("hidOSIFecHoy").value = vRes;
}

function fOSIParEstCbo(vCbo, vEst) {
	fComboClean(vCbo);
	var oCbo = dijit.byId(vCbo);
	// Cargar uno en todos
	var oOpt = {};
	oOpt.label = "...";
	oOpt.value = "0";
	oOpt.selected = true;
	oCbo.addOption(oOpt);
	if (vEst == 0 || vEst == 10) {
		oOpt = {};
		oOpt.label = "NUEVO";
		oOpt.value = "1";
		oCbo.addOption(oOpt);
	}
	if (vEst != 10) {
		oOpt = {};
		oOpt.label = "PENDIENTE";
		oOpt.value = "5";
		oCbo.addOption(oOpt);
		oOpt = {};
		oOpt.label = "VERIFICADO";
		oOpt.value = "3";
		oCbo.addOption(oOpt);
	}
	oOpt = {};
	oOpt.label = "ANULADO";
	oOpt.value = "6";
	oCbo.addOption(oOpt);
}

function fOSIParTDoCbo(vRes) {
	fComboClean("cboOSI_CON_ASE_TDO");
	fComboClean("cboOSI_CON_TOM_TDO");
	fComboClean("cboOSI_CON_DEN_TDO");
	var oCboA = dijit.byId("cboOSI_CON_ASE_TDO");
	var oCboT = dijit.byId("cboOSI_CON_TOM_TDO");
	var oCboD = dijit.byId("cboOSI_CON_DEN_TDO");
	var vJSON = vRes;
	// Cargar uno en todos
	var oOpt = {};
	oOpt.label = "...";
	oOpt.value = "0";
	oOpt.selected = true;
	oCboA.addOption(oOpt);
	oCboT.addOption(oOpt);
	oCboD.addOption(oOpt);
	// Cargar combo
	for ( var i in vJSON.TIPOS.TIPO) {
		oOpt = {};
		oOpt.label = vJSON.TIPOS.TIPO[i].POV_DES_TDO;
		oOpt.value = String(vJSON.TIPOS.TIPO[i].POV_COD_TDO);
		oOpt.selected = false;
		oCboA.addOption(oOpt);
		oCboT.addOption(oOpt);
		oCboD.addOption(oOpt);
	}
}

function fOSISinEstOtr() {
	dijit.byId("cboOSI_CON_COD_OTR").set("value", "0");
	document.getElementById("spaOSI_CON_OTR").style.display = "none";
	if (dijit.byId("cboOSI_CON_COD_EST").get("value") != "0") {
		if (dijit.byId("cboOSI_CON_COD_EST").get("value").split("|")[1] == "CBO_MOT") {
			document.getElementById("spaOSI_CON_OTR").style.display = "inline";
		}
	}
}

function fOSISinCle() {
	// Datos
	document.getElementById("txtOSI_SIN_NRO_OPE").innerHTML = "";
	document.getElementById("txtOSI_SIN_NRO_OPE").cntArch = 0;
	document.getElementById("txtOSI_SIN_NRO_OPE").producto = "";
	document.getElementById("txtOSI_SIN_NRO_OPE").operacion = "";
	document.getElementById("txtOSI_SIN_NRO_OPE").permiso = false;
	document.getElementById("txtOSI_SIN_FEC_ING").innerHTML = "";
	document.getElementById("txtOSI_SIN_NRO_POL").innerHTML = "";
	document.getElementById("txtOSI_SIN_ASE_SIN").innerHTML = "";
	document.getElementById("txtOSI_SIN_DES_EST").innerHTML = "";
	document.getElementById("txtOSI_SIN_DES_EST").estado = "";
	document.getElementById("txtOSI_SIN_UMA_FEC").innerHTML = "";
	document.getElementById("txtOSI_SIN_UMA_USU").innerHTML = "";
	dijit.byId("txtOSI_SIN_OBS_OPE").set("value", "");
	// Tree
	if (dijit.byId("treOSIArc") != null) {
		fDestroyElement("treOSIArc");
		document.getElementById("tdOSIArc").innerHTML = '<div id="_divOSIArc" style="width: 400px; height: 500px;"></div>';
	}
}

function fOSIArcCon() {
	if (fSessionValidate().pSft) {
		fOSIArcConExec();
	}
}

function fOSIArcConExec() {
	// Validaciones
	// Fecha de Ingreso
	if (dijit.byId("chkOSI_CON_FEC_ING").get("checked")) {
		if (dijit.byId("dtxOSI_CON_FEC_IND").get("value") == null) {
			fMsgBox("Fecha de Ingreso:<br/>" + "Desde inv&aacute;lido.",
					"Validaci&oacute;n", "W");
			return;
		}
		if (dijit.byId("dtxOSI_CON_FEC_INH").get("value") == null) {
			fMsgBox("Fecha de Ingreso:<br/>" + "Hasta inv&aacute;lido.",
					"Validaci&oacute;n", "W");
			return;
		}
		// Obtengo las fechas
		var vFInDes = dojo.date.locale.format(dijit.byId("dtxOSI_CON_FEC_IND")
				.get("value"), {
			datePattern : "yyyyMMdd",
			selector : "date"
		});
		var vFInHas = dojo.date.locale.format(dijit.byId("dtxOSI_CON_FEC_INH")
				.get("value"), {
			datePattern : "yyyyMMdd",
			selector : "date"
		});
		// Rango
		if (vFInHas < vFInDes) {
			fMsgBox("Fecha de Ingreso:<br/>"
					+ "Hasta debe ser mayor o igual a Desde.",
					"Validaci&oacute;n", "W");
			return;
		}
		if (vFInHas > document.getElementById("hidOSIFecHoy").value) {
			fMsgBox("Fecha de Ingreso:<br/>"
					+ "Hasta no debe ser mayor a la fecha actual.",
					"Validaci&oacute;n", "W");
			return;
		}
		if (fDateAdd(vFInDes, 366) < vFInHas) {
			fMsgBox("Fecha de Ingreso:<br/>"
					+ "El rango no debe superar un a&ntilde;o.",
					"Validaci&oacute;n", "W");
			return;
		}
		// Nro. Operacion, no es obligatorio
		if (dijit.byId("txtOSI_CON_NRO_OPE").get("value") == undefined) {
			fMsgBox("N&uacute;mero de Operaci&oacute;n:<br/>"
					+ "Debe ingresar un valor num&eacute;rico.",
					"Validaci&oacute;n", "W");
			return;
		}
		// Excel
		window.open(fGetURLMVC("dwlExcelSinSvc.html?" + "cache="
				+ fGetCacheRnd() + "&tipoExl=A" + fOSIArcConPar()), "excelArc",
				"resizable=yes,height=700,width=900,top=100,left=100");
	} else {
		fMsgBox("Fecha de Ingreso:<br/>"
				+ "Debe ingresar una fecha de ingreso para filtrar.",
				"Validaci&oacute;n", "W");
	}
}

function fOSIArcConPar() {
	var vPar = "";
	if (!isNaN(dijit.byId("txtOSI_CON_NRO_OPE").get("value"))) {
		vPar += "&operacion=" + dijit.byId("txtOSI_CON_NRO_OPE").get("value");
	} else {
		vPar += "&operacion=0";
	}
	vPar += "&ideArch=" + "PDF_OTR_ADD";
	// Obtengo las fechas
	var vFInDes = 20180101;
	var vFInHas = 21000101;
	if (dijit.byId("chkOSI_CON_FEC_ING").get("checked")) {
		if (dijit.byId("dtxOSI_CON_FEC_IND").get("value") != null) {
			vFInDes = dojo.date.locale.format(dijit.byId("dtxOSI_CON_FEC_IND")
					.get("value"), {
				datePattern : "yyyyMMdd",
				selector : "date"
			});
		}
		if (dijit.byId("dtxOSI_CON_FEC_INH").get("value") != null) {
			vFInHas = dojo.date.locale.format(dijit.byId("dtxOSI_CON_FEC_INH")
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

function fOSIArcROn(value) {
	// Botones
	dijit.byId("btnOSIArcVie").set("disabled", value);
	if (document.getElementById("txtOSI_SIN_NRO_OPE").permiso) {
		dijit.byId("btnOSIArcDel").set("disabled", value);
		dijit.byId("btnOSIArcUpd").set("disabled", value);
	}
}

function fOSIArcCle() {
	// Datos
	document.getElementById("txtOSI_ARC_DES_ARC").innerHTML = "";
	document.getElementById("txtOSI_ARC_TIP_ARC").innerHTML = "";
	document.getElementById("txtOSI_ARC_TIP_ARC").archivo = "";
	document.getElementById("txtOSI_ARC_TIP_ARC").estArch = "";
	document.getElementById("txtOSI_ARC_UIN_FEC").innerHTML = "";
	document.getElementById("txtOSI_ARC_UIN_USU").innerHTML = "";
	document.getElementById("txtOSI_ARC_IDE_ARC").innerHTML = "";
	dijit.byId("txtOSI_ARC_OBS_ARC").set("value", "");
}

function fOSIConFInChk() {
	if (dijit.byId("chkOSI_CON_FEC_ING").get("checked")) {
		dijit.byId("dtxOSI_CON_FEC_IND").set("disabled", false);
		dijit.byId("dtxOSI_CON_FEC_INH").set("disabled", false);
		dijit.byId("dtxOSI_CON_FEC_IND").set(
				"value",
				fFormatDTB(fDateAdd(
						document.getElementById("hidOSIFecHoy").value, -7)));
		dijit.byId("dtxOSI_CON_FEC_INH").set("value",
				fFormatDTB(document.getElementById("hidOSIFecHoy").value));
	} else {
		dijit.byId("dtxOSI_CON_FEC_IND").set("disabled", true);
		dijit.byId("dtxOSI_CON_FEC_INH").set("disabled", true);
		dijit.byId("dtxOSI_CON_FEC_IND").set("value", null);
		dijit.byId("dtxOSI_CON_FEC_INH").set("value", null);
	}
}

function fOSIConFMaChk() {
	if (dijit.byId("chkOSI_CON_FEC_MAN").get("checked")) {
		dijit.byId("dtxOSI_CON_FEC_MAD").set("disabled", false);
		dijit.byId("dtxOSI_CON_FEC_MAH").set("disabled", false);
		dijit.byId("dtxOSI_CON_FEC_MAD").set(
				"value",
				fFormatDTB(fDateAdd(
						document.getElementById("hidOSIFecHoy").value, -7)));

		dijit.byId("dtxOSI_CON_FEC_MAH").set("value",
				fFormatDTB(document.getElementById("hidOSIFecHoy").value));
	} else {
		dijit.byId("dtxOSI_CON_FEC_MAD").set("disabled", true);
		dijit.byId("dtxOSI_CON_FEC_MAH").set("disabled", true);
		dijit.byId("dtxOSI_CON_FEC_MAD").set("value", null);
		dijit.byId("dtxOSI_CON_FEC_MAH").set("value", null);
	}
}

function fOSISinCon() {
	if (fSessionValidate().pSft) {
		fOSISinConExec();
	}
}

function fOSISinConExec() {
	// Validar
	if (!fOSISinConVal()) {
		return;
	}
	// Limpiar
	fGridTltDisconnect();
	// Consulta
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("OperationService/getSinFiltroList?cache="
				+ fGetCacheRnd() + fOSISinConPar());
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

				if (dijit.byId("dgrOSISinLis") == null) {
					oGrid = new DataGrid({
						id : "dgrOSISinLis",
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
					}, "_divOSISinLis");

					oGrid.startup();
				} else {
					dijit.byId("dgrOSISinLis").setStructure(layout);
					dijit.byId("dgrOSISinLis").setStore(jsonDataSource);
				}
				// Botones y paneles
				document.getElementById("divOSIFil").style.display = "none";
				document.getElementById("divOSISin").style.display = "inline";
				fOSISinCle();
				fOSIArcCle();
				dijit.byId("dgrOSISinLis").update();
				document.getElementById("hTltExec").value = "S";
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fOSISinConVal() {
	// Nro. Operacion
	if (dijit.byId("txtOSI_CON_NRO_OPE").get("value") == undefined) {
		fMsgBox("N&uacute;mero de Operaci&oacute;n:<br/>"
				+ "Debe ingresar un valor num&eacute;rico.",
				"Validaci&oacute;n", "W");
		return false;
	}
	// Fecha de Ingreso
	if (dijit.byId("chkOSI_CON_FEC_ING").get("checked")) {
		if (dijit.byId("dtxOSI_CON_FEC_IND").get("value") == null) {
			fMsgBox("Fecha de Ingreso:<br/>" + "Desde inv&aacute;lido.",
					"Validaci&oacute;n", "W");
			return false;
		}
		if (dijit.byId("dtxOSI_CON_FEC_INH").get("value") == null) {
			fMsgBox("Fecha de Ingreso:<br/>" + "Hasta inv&aacute;lido.",
					"Validaci&oacute;n", "W");
			return false;
		}
		// Obtengo las fechas
		var vFInDes = dojo.date.locale.format(dijit.byId("dtxOSI_CON_FEC_IND")
				.get("value"), {
			datePattern : "yyyyMMdd",
			selector : "date"
		});
		var vFInHas = dojo.date.locale.format(dijit.byId("dtxOSI_CON_FEC_INH")
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
		if (vFInHas > document.getElementById("hidOSIFecHoy").value) {
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
	if (dijit.byId("chkOSI_CON_FEC_MAN").get("checked")) {
		if (dijit.byId("dtxOSI_CON_FEC_MAD").get("value") == null) {
			fMsgBox("Fecha de Actualizaci&oacute;n:<br/>"
					+ "Desde inv&aacute;lido.", "Validaci&oacute;n", "W");
			return false;
		}
		if (dijit.byId("dtxOSI_CON_FEC_MAH").get("value") == null) {
			fMsgBox("Fecha de Actualizaci&oacute;n:<br/>"
					+ "Hasta inv&aacute;lido.", "Validaci&oacute;n", "W");
			return false;
		}
		// Obtengo las fechas
		var vFMaDes = dojo.date.locale.format(dijit.byId("dtxOSI_CON_FEC_MAD")
				.get("value"), {
			datePattern : "yyyyMMdd",
			selector : "date"
		});
		var vFMaHas = dojo.date.locale.format(dijit.byId("dtxOSI_CON_FEC_MAH")
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
		if (vFMaHas > document.getElementById("hidOSIFecHoy").value) {
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
	if (dijit.byId("txtOSI_CON_ASE_NDO").get("value") == undefined) {
		fMsgBox("N&uacute;mero de Documento:<br/>"
				+ "Debe ingresar un valor num&eacute;rico.",
				"Validaci&oacute;n", "W");
		return false;
	}
	// Apellido y Nombre
	if (dijit.byId("txtOSI_CON_ASE_APE").get("value") != "") {
		if (dijit.byId("txtOSI_CON_ASE_APE").get("value").length < 4) {
			fMsgBox("Apellido del asegurado:<br/>"
					+ "Debe ingresar al menos 4 caracteres.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	if (dijit.byId("txtOSI_CON_ASE_NOM").get("value") != "") {
		if (dijit.byId("txtOSI_CON_ASE_NOM").get("value").length < 4) {
			fMsgBox("Nombre del asegurado:<br/>"
					+ "Debe ingresar al menos 4 caracteres.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	// Nro. Documento
	if (dijit.byId("txtOSI_CON_TOM_NDO").get("value") == undefined) {
		fMsgBox("N&uacute;mero de Documento:<br/>"
				+ "Debe ingresar un valor num&eacute;rico.",
				"Validaci&oacute;n", "W");
		return false;
	}
	// Apellido y Nombre
	if (dijit.byId("txtOSI_CON_TOM_APE").get("value") != "") {
		if (dijit.byId("txtOSI_CON_TOM_APE").get("value").length < 4) {
			fMsgBox("Apellido del tomador:<br/>"
					+ "Debe ingresar al menos 4 caracteres.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	if (dijit.byId("txtOSI_CON_TOM_NOM").get("value") != "") {
		if (dijit.byId("txtOSI_CON_TOM_NOM").get("value").length < 4) {
			fMsgBox("Nombre del tomador:<br/>"
					+ "Debe ingresar al menos 4 caracteres.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	// Nro. Documento
	if (dijit.byId("txtOSI_CON_DEN_NDO").get("value") == undefined) {
		fMsgBox("N&uacute;mero de Documento:<br/>"
				+ "Debe ingresar un valor num&eacute;rico.",
				"Validaci&oacute;n", "W");
		return false;
	}
	// Apellido y Nombre
	if (dijit.byId("txtOSI_CON_DEN_APE").get("value") != "") {
		if (dijit.byId("txtOSI_CON_DEN_APE").get("value").length < 4) {
			fMsgBox("Apellido del denunciante:<br/>"
					+ "Debe ingresar al menos 4 caracteres.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	if (dijit.byId("txtOSI_CON_DEN_NOM").get("value") != "") {
		if (dijit.byId("txtOSI_CON_DEN_NOM").get("value").length < 4) {
			fMsgBox("Nombre del denunciante:<br/>"
					+ "Debe ingresar al menos 4 caracteres.",
					"Validaci&oacute;n", "W");
			return false;
		}
	}
	// Verificar que se selecciono algun filtro
	if (isNaN(dijit.byId("txtOSI_CON_NRO_OPE").get("value"))
			&& dijit.byId("txtOSI_CON_COD_PRO").get("value") == ""
			&& dijit.byId("txtOSI_CON_NRO_POL").get("value") == ""
			&& dijit.byId("cboOSI_CON_COD_EST").get("value") == "0"
			&& dijit.byId("chkOSI_CON_FEC_ING").get("checked") == false
			&& dijit.byId("chkOSI_CON_FEC_MAN").get("checked") == false
			&& dijit.byId("cboOSI_CON_ASE_TDO").get("value") == "0"
			&& isNaN(dijit.byId("txtOSI_CON_ASE_NDO").get("value"))
			&& dijit.byId("txtOSI_CON_ASE_APE").get("value") == ""
			&& dijit.byId("txtOSI_CON_ASE_NOM").get("value") == ""
			&& dijit.byId("cboOSI_CON_TOM_TDO").get("value") == "0"
			&& isNaN(dijit.byId("txtOSI_CON_TOM_NDO").get("value"))
			&& dijit.byId("txtOSI_CON_TOM_APE").get("value") == ""
			&& dijit.byId("txtOSI_CON_TOM_NOM").get("value") == ""
			&& dijit.byId("cboOSI_CON_DEN_TDO").get("value") == "0"
			&& isNaN(dijit.byId("txtOSI_CON_DEN_NDO").get("value"))
			&& dijit.byId("txtOSI_CON_DEN_APE").get("value") == ""
			&& dijit.byId("txtOSI_CON_DEN_NOM").get("value") == "") {
		fMsgBox("Debe seleccionar al menos un filtro de b&uacute;squeda.",
				"Validaci&oacute;n", "W");
		return false;
	}
	return true;
}

function fOSISinConPar() {
	var vPar = "";
	if (!isNaN(dijit.byId("txtOSI_CON_NRO_OPE").get("value"))) {
		vPar += "&operacion=" + dijit.byId("txtOSI_CON_NRO_OPE").get("value");
	} else {
		vPar += "&operacion=0";
	}
	vPar += "&producto=" + dijit.byId("txtOSI_CON_COD_PRO").get("value");
	vPar += "&poliza=" + dijit.byId("txtOSI_CON_NRO_POL").get("value");
	vPar += "&estado=" + dijit.byId("cboOSI_CON_COD_EST").get("value");
	// Obtengo las fechas
	var vFInDes = 20180101;
	var vFInHas = 21000101;
	if (dijit.byId("chkOSI_CON_FEC_ING").get("checked")) {
		if (dijit.byId("dtxOSI_CON_FEC_IND").get("value") != null) {
			vFInDes = dojo.date.locale.format(dijit.byId("dtxOSI_CON_FEC_IND")
					.get("value"), {
				datePattern : "yyyyMMdd",
				selector : "date"
			});
		}
		if (dijit.byId("dtxOSI_CON_FEC_INH").get("value") != null) {
			vFInHas = dojo.date.locale.format(dijit.byId("dtxOSI_CON_FEC_INH")
					.get("value"), {
				datePattern : "yyyyMMdd",
				selector : "date"
			});
		}
	}
	var vFMaDes = 20180101;
	var vFMaHas = 21000101;
	if (dijit.byId("chkOSI_CON_FEC_MAN").get("checked")) {
		if (dijit.byId("dtxOSI_CON_FEC_MAD").get("value") != null) {
			vFMaDes = dojo.date.locale.format(dijit.byId("dtxOSI_CON_FEC_MAD")
					.get("value"), {
				datePattern : "yyyyMMdd",
				selector : "date"
			});
		}
		if (dijit.byId("dtxOSI_CON_FEC_MAH").get("value") != null) {
			vFMaHas = dojo.date.locale.format(dijit.byId("dtxOSI_CON_FEC_MAH")
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
	vPar += "&asegTipDoc=" + dijit.byId("cboOSI_CON_ASE_TDO").get("value");
	if (!isNaN(dijit.byId("txtOSI_CON_ASE_NDO").get("value"))) {
		vPar += "&asegNroDoc=" + dijit.byId("txtOSI_CON_ASE_NDO").get("value");
	} else {
		vPar += "&asegNroDoc=";
	}
	vPar += "&asegApellido=" + dijit.byId("txtOSI_CON_ASE_APE").get("value");
	vPar += "&asegNombre=" + dijit.byId("txtOSI_CON_ASE_NOM").get("value");
	vPar += "&tomaTipDoc=" + dijit.byId("cboOSI_CON_TOM_TDO").get("value");
	if (!isNaN(dijit.byId("txtOSI_CON_TOM_NDO").get("value"))) {
		vPar += "&tomaNroDoc=" + dijit.byId("txtOSI_CON_TOM_NDO").get("value");
	} else {
		vPar += "&tomaNroDoc=";
	}
	vPar += "&tomaApellido=" + dijit.byId("txtOSI_CON_TOM_APE").get("value");
	vPar += "&tomaNombre=" + dijit.byId("txtOSI_CON_TOM_NOM").get("value");
	vPar += "&denuTipDoc=" + dijit.byId("cboOSI_CON_DEN_TDO").get("value");
	if (!isNaN(dijit.byId("txtOSI_CON_DEN_NDO").get("value"))) {
		vPar += "&denuNroDoc=" + dijit.byId("txtOSI_CON_DEN_NDO").get("value");
	} else {
		vPar += "&denuNroDoc=";
	}
	vPar += "&denuApellido=" + dijit.byId("txtOSI_CON_DEN_APE").get("value");
	vPar += "&denuNombre=" + dijit.byId("txtOSI_CON_DEN_NOM").get("value");
	return vPar;
}

function fOSISinLim() {
	dijit.byId("txtOSI_CON_NRO_OPE").set("value", "");
	dijit.byId("txtOSI_CON_COD_PRO").set("value", "");
	dijit.byId("txtOSI_CON_NRO_POL").set("value", "");
	dijit.byId("cboOSI_CON_COD_EST").set("value", "0");
	dijit.byId("chkOSI_CON_FEC_ING").set("checked", false);
	dijit.byId("chkOSI_CON_FEC_MAN").set("checked", false);
	dijit.byId("cboOSI_CON_ASE_TDO").set("value", "0");
	dijit.byId("txtOSI_CON_ASE_NDO").set("value", "");
	dijit.byId("txtOSI_CON_ASE_APE").set("value", "");
	dijit.byId("txtOSI_CON_ASE_NOM").set("value", "");
	dijit.byId("cboOSI_CON_TOM_TDO").set("value", "0");
	dijit.byId("txtOSI_CON_TOM_NDO").set("value", "");
	dijit.byId("txtOSI_CON_TOM_APE").set("value", "");
	dijit.byId("txtOSI_CON_TOM_NOM").set("value", "");
	dijit.byId("cboOSI_CON_DEN_TDO").set("value", "0");
	dijit.byId("txtOSI_CON_DEN_NDO").set("value", "");
	dijit.byId("txtOSI_CON_DEN_APE").set("value", "");
	dijit.byId("txtOSI_CON_DEN_NOM").set("value", "");
	// Defaults
	dijit.byId("cboOSI_CON_COD_EST").set("value", 1);
}

function fOSISinVol() {
	if (fSessionValidate().pSft) {
		fOSISinVolExec();
	}
}

function fOSISinVolExec() {
	document.getElementById("divOSIFil").style.display = "inline";
	document.getElementById("divOSISin").style.display = "none";
	fOSISinCle();
	fOSIArcROn(true);
	fOSIArcCle();
}

function fOSISinDet() {
	var ssn = fSessionValidate();
	if (ssn.pSft) {
		fOSISinDetExec(ssn.pSft, ssn.key, ssn.type);
	}
}

function fOSISinDetExec(vPeopleSoft, vProfileKey, vProfileType) {
	var oGrid = dijit.byId("dgrOSISinLis");
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
		var vURL = fGetURLSvc("OperationService/getArchivoXSinList?cache="
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
				var vArcTre = fOSISinTomArc(vJSON);
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
				fOSISinCle();
				fOSISinTomTre(vTreeModel);
				// Botones y paneles
				document.getElementById("divOSISin").style.display = "none";
				document.getElementById("divOSIArc").style.display = "inline";
				// Datos
				fOSISinTomDat(oItems[0], vProfileKey);
				fOSISinGrant();
				fOSIArcROn(true);
			}
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fOSISinTomArc(vJSON) {
	var vArcTre = [];
	var vArcDoc = [];

	for (var i = 0; i < vJSON.REG.length; i++) {
		// Genero la leyenda variable
		var vLabel = '<font color="red"><b>';
		vLabel += vJSON.REG[i].UIN_FEC + '</b></font>';
		if (vJSON.REG[i].IDE_ARC.length > 0) {
			if (vJSON.REG[i].IDE_ARC.substr(0, 7) == "PDF_ADJ") {
				vLabel += " - ARCHIVO ADJUNTO";
			} else if (vJSON.REG[i].IDE_ARC.substr(0, 7) == "PDF_OTR") {
				vLabel += " - ARCHIVO ADJUNTO ADICIONAL";
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
		label : '<b>ARCHIVO DEL SINIESTRO</b>',
		id : "1",
		tipo : "GDO",
		children : vArcDoc
	});
	vArcDoc = [];
	// Retorno
	return vArcTre;
}

function fOSISinTomTre(vTreeModel) {
	if (dijit.byId("treOSIArc") == null) {
		oTree = dijit.Tree({
			id : "treOSIArc",
			style : 'width: 400px;height: 390px;',
			model : vTreeModel,
			autoExpand : true,
			showRoot : false,
			_createTreeNode : function(args) {
				var tnode = new dijit._TreeNode(args);
				tnode.labelNode.innerHTML = args.label;
				return tnode;
			},
			onClick : function(item) {
				fOSIArcDat(item);
			},
			onDblClick : function(item) {
				fOSIArcVie();
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
		}, "_divOSIArc");

		oTree.startup();
	}
}

function fOSISinTomDat(vItem, vProfileKey) {
	// Cargar Datos
	document.getElementById("txtOSI_SIN_NRO_OPE").innerHTML = vItem.COD_PRO[0]
			+ " " + vItem.NRO_OPE[0];
	document.getElementById("txtOSI_SIN_NRO_OPE").producto = vItem.COD_PRO[0];
	document.getElementById("txtOSI_SIN_NRO_OPE").operacion = vItem.NRO_OPE[0];
	document.getElementById("txtOSI_SIN_NRO_OPE").permiso = (vProfileKey != "S" ? false
			: true);
	document.getElementById("txtOSI_SIN_FEC_ING").innerHTML = vItem.FEC_ING[0];
	document.getElementById("txtOSI_SIN_NRO_POL").innerHTML = vItem.NRO_POL[0];
	document.getElementById("txtOSI_SIN_ASE_SIN").innerHTML = vItem.ASE_TDD[0]
			+ " " + vItem.ASE_NDO[0] + " " + vItem.ASE_APE[0] + " "
			+ vItem.ASE_NOM[0];
	document.getElementById("txtOSI_SIN_TOM_SIN").innerHTML = vItem.TOM_TDD[0]
			+ " " + vItem.TOM_NDO[0] + " " + vItem.TOM_APE[0] + " "
			+ vItem.TOM_NOM[0];
	document.getElementById("txtOSI_SIN_DEN_SIN").innerHTML = vItem.DEN_TDD[0]
			+ " " + vItem.DEN_NDO[0] + " " + vItem.DEN_APE[0] + " "
			+ vItem.DEN_NOM[0];
	document.getElementById("txtOSI_SIN_DES_EST").innerHTML = vItem.DES_EST[0];
	document.getElementById("txtOSI_SIN_DES_EST").estado = vItem.COD_EST[0];
	document.getElementById("txtOSI_SIN_UMA_FEC").innerHTML = vItem.UMA_FEC[0];
	document.getElementById("txtOSI_SIN_UMA_USU").innerHTML = vItem.UMA_COD[0]
			+ " " + vItem.UMA_APE[0] + " " + vItem.UMA_NOM[0];
	dijit.byId("txtOSI_SIN_OBS_OPE").set("value", vItem.OBS_OPE[0]);
}

function fOSISinGrant() {
	// Botones
	if (document.getElementById("txtOSI_SIN_DES_EST").estado != 1
			&& document.getElementById("txtOSI_SIN_DES_EST").estado != 5
			&& document.getElementById("txtOSI_SIN_DES_EST").estado != 10) {
		dijit.byId("btnOSISinEst").set("disabled", true);
		dijit.byId("btnOSIArcAdd").set("disabled", true);
		dijit.byId("btnOSIArcDel").set("disabled", true);
		dijit.byId("btnOSIArcUpd").set("disabled", true);
		document.getElementById("txtOSI_SIN_NRO_OPE").permiso = false;
	} else if (!document.getElementById("txtOSI_SIN_NRO_OPE").permiso) {
		dijit.byId("btnOSISinEst").set("disabled", true);
		dijit.byId("btnOSIArcAdd").set("disabled", true);
		dijit.byId("btnOSIArcDel").set("disabled", true);
		dijit.byId("btnOSIArcUpd").set("disabled", true);
	} else {
		// cambiar estado para EN PROCESO
		if (document.getElementById("txtOSI_SIN_DES_EST").estado == 10) {
			dijit.byId("btnOSISinEst").set("disabled", false);
			dijit.byId("btnOSIArcAdd").set("disabled", true);
		} else {
			dijit.byId("btnOSISinEst").set("disabled", false);
			dijit.byId("btnOSIArcAdd").set("disabled", false);
		}
	}
}

function fOSIArcDat(vItem) {
	if (vItem.NRO_ARC != undefined) {
		// Paneles
		fOSIArcCle();
		fOSIArcROn(false);
		// Datos
		document.getElementById("txtOSI_ARC_DES_ARC").innerHTML = vItem.DES_ARC[0];
		document.getElementById("txtOSI_ARC_TIP_ARC").innerHTML = vItem.TIP_ARC[0];
		document.getElementById("txtOSI_ARC_TIP_ARC").archivo = vItem.NRO_ARC[0];
		document.getElementById("txtOSI_ARC_TIP_ARC").estArch = vItem.EST_ARC[0];
		document.getElementById("txtOSI_ARC_UIN_FEC").innerHTML = vItem.UIN_FEC[0];
		document.getElementById("txtOSI_ARC_UIN_USU").innerHTML = vItem.UIN_COD[0]
				+ " " + vItem.UIN_APE[0] + " " + vItem.UIN_NOM[0];
		document.getElementById("txtOSI_ARC_IDE_ARC").innerHTML = vItem.IDE_ARC[0];
		dijit.byId("txtOSI_ARC_OBS_ARC").set("value", vItem.OBS_ARC[0]);
	} else {
		fOSIArcROn(true);
		fOSIArcCle();
	}
}

function fOSIArcVie() {
	if (fSessionValidate().pSft) {
		fOSIArcVieExec();
	}
}

function fOSIArcVieExec(vItem) {
	// Visualizacion
	if (!dijit.byId("btnOSIArcVie").get("disabled")) {
		if (document.getElementById("txtOSI_ARC_TIP_ARC").estArch == "0") {
			document.getElementById("txtOSI_SIN_NRO_OPE").cntArch++;
			var vNRO_ARC = document.getElementById("txtOSI_ARC_TIP_ARC").archivo;
			var vTIP_ARC = document.getElementById("txtOSI_ARC_TIP_ARC").innerHTML;
			var vCNT_ARC = document.getElementById("txtOSI_SIN_NRO_OPE").cntArch;
			if (vCNT_ARC > 10) {
				document.getElementById("txtOSI_SIN_NRO_OPE").cntArch = 0;
			}
			var vEXT_ARC = "";
			if (document.getElementById("txtOSI_ARC_TIP_ARC").innerHTML == "application/octet-stream") {
				vEXT_ARC = document.getElementById("txtOSI_ARC_DES_ARC").innerHTML
						.split(".")[1];
			}
			window.open(fGetURLMVC("downloadSvc.html?" + "cache="
					+ fGetCacheRnd() + "&proceso=SIN" + "&archivo=" + vNRO_ARC
					+ "&tipoArchivo=" + vTIP_ARC + "&extension=" + vEXT_ARC),
					"viewArc" + vNRO_ARC,
					"resizable=yes,height=700,width=900,top="
							+ String(90 + (vCNT_ARC * 10)) + ",left="
							+ String(90 + (vCNT_ARC * 10)));
		} else if (document.getElementById("txtOSI_ARC_TIP_ARC").estArch == "2") {
			fMsgBox("El archivo fue depurado en proceso autom&aacute;tico.",
					"Advertencia", "W");
		} else if (document.getElementById("txtOSI_ARC_TIP_ARC").estArch == "3") {
			fMsgBox("El archivo fue enviado a FileNet.", "Advertencia", "W");
		} else {
			fMsgBox("Se produjo un error al leer el archivo.", "Error", "E");
		}
	}
}

function fOSIArcAdd() {
	if (fSessionValidate().pSft) {
		fOSIArcAddExec();
	}
}

function fOSIArcAddExec() {
	// Limpiar y cargar
	document.frmOSIUpload.reset();
	dijit.byId("cboOSI_AGR_TAR").set("value", "");
	dijit.byId("txtOSI_AGR_DES").set("value", "");
	dijit.byId("txtOSI_AGR_IDE").set("value", "");
	dijit.byId("txtOSI_AGR_OBS").set("value", "");
	dijit.byId("dlgOSIUplBox").show();
}

function fOSIArcUpl() {
	if (fSessionValidate().pSft) {
		fOSIArcUplExec();
	}
}

function fOSIArcUplExec() {
	// Validacion de datos
	if (dijit.byId("cboOSI_AGR_TAR").get("value") == "") {
		fMsgBox("Debe seleccionar el tipo de archivo.", "Validaci&oacute;n",
				"W");
		return;
	}
	var vIdeArc = "";
	if (document.getElementById("txtOSIUplFil").value != "") {
		var vExt = document.getElementById("txtOSIUplFil").value.substr(
				document.getElementById("txtOSIUplFil").value.length - 4)
				.toUpperCase();
		var vTAr = dijit.byId("cboOSI_AGR_TAR").get("value");
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
	if (String(dijit.byId("txtOSI_AGR_DES").get("value")).length == 0) {
		fMsgBox("Debe ingresar la descripci&oacute;n del archivo.",
				"Validaci&oacute;n", "W");
		return;
	} else if (!fValType("T", dijit.byId("txtOSI_AGR_DES").get("value"))) {
		fMsgBox("La descripci&oacute;n tienen caracteres inv&aacute;lidos.",
				"Validaci&oacute;n", "W");
		return;
	}
	if (!fValType("T", dijit.byId("txtOSI_AGR_OBS").get("value"))) {
		fMsgBox("Las observaciones tienen caracteres inv&aacute;lidos.",
				"Validaci&oacute;n", "W");
		return;
	}
	// Agregar
	document.getElementById("hOSIUplHab").value = "S";
	// Si es OTRO agregar la extension a la descripcion
	var vArcDesc = fEncodeURI(dijit.byId("txtOSI_AGR_DES").get("value"));
	if (dijit.byId("cboOSI_AGR_TAR").get("value") == "application/octet-stream") {
		vArcDesc = vArcDesc.replaceAll(".", "");
		vArcDesc += "."
				+ document.frmOSIUpload.txtOSIUplFil.files[0].name.split(".")[1];
	}
	document.frmOSIUpload.action = fGetURLMVC("publishSvc.html?" + "cache="
			+ fGetCacheRnd() + "&proceso=SIN" + "&operacion="
			+ document.getElementById("txtOSI_SIN_NRO_OPE").operacion
			+ "&tipoArchivo=" + dijit.byId("cboOSI_AGR_TAR").get("value")
			+ "&arcDesc=" + vArcDesc + "&arcIde=" + vIdeArc + "&arcObserv="
			+ fEncodeURI(dijit.byId("txtOSI_AGR_OBS").get("value")));
	document.frmOSIUpload.submit();
}

function fOSIArcUplRet() {
	if (document.getElementById("hOSIUplHab").value == "S") {
		var vIfr = document.getElementById("ifrOSIUpload");
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
					dijit.byId("dlgOSIUplBox").onCancel();
					fMsgBox("Archivo agregado con &eacute;xito!", "Exito", "O");
					fOSISinDet();
				}
			}
		} catch (err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		}
		document.getElementById("hOSIUplHab").value = "N";
	}
}

function fOSIArcDel() {
	if (fSessionValidate().pSft) {
		fOSIArcDelExec();
	}
}

function fOSIArcDelExec() {
	// Validacion
	var vIdeArc = document.getElementById("txtOSI_ARC_IDE_ARC").innerHTML;
	if (vIdeArc.substr(4, 7) != "ARC_ADD") {
		fMsgBox("No se puede eliminar un archivo" + "<br/>"
				+ "subido desde la app de Siniestros.", "Validaci&oacute;n",
				"W");
		return;
	}
	// Cargar
	document.getElementById("hOSIEstFnc").value = "ADE";
	document.getElementById("ttrOSIEstCod").style.display = "none";
	document.getElementById("ttrOSIEstObs").style.display = "";
	dijit.byId("txtOSI_EST_OBS").set("value", "");
	dijit.byId("dlgOSIEstBox").set("title", "Eliminar archivo");
	dijit.byId("dlgOSIEstBox").show();
}

function fOSIArcDelDo() {
	// Validacion de datos
	if (String(dijit.byId("txtOSI_EST_OBS").get("value")).length > 0) {
		if (!fValType("T", dijit.byId("txtOSI_EST_OBS").get("value"))) {
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
		var vURL = fGetURLSvc("OperationService/delArchivoXSin");
		var vPar = "cache=" + fGetCacheRnd() + "&operacion="
				+ document.getElementById("txtOSI_SIN_NRO_OPE").operacion
				+ "&archivo="
				+ document.getElementById("txtOSI_ARC_TIP_ARC").archivo
				+ "&observaciones="
				+ fEncodeURI(dijit.byId("txtOSI_EST_OBS").get("value"));
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
						dijit.byId('dlgOSIEstBox').onCancel();
						fMsgBox("Archivo eliminado con &eacute;xito!", "Exito",
								"O");
						fOSIArcCle();
						fOSISinDet();
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

function fOSIArcUpd() {
	if (fSessionValidate().pSft) {
		fOSIArcUpdExec();
	}
}

function fOSIArcUpdExec() {
	// Cargar
	document.getElementById("hOSIEstFnc").value = "AUP";
	document.getElementById("ttrOSIEstCod").style.display = "none";
	document.getElementById("ttrOSIEstObs").style.display = "";
	dijit.byId("txtOSI_EST_OBS").set("value",
			dijit.byId("txtOSI_ARC_OBS_ARC").get("value"));
	dijit.byId("dlgOSIEstBox").set("title", "Modificar Observaciones");
	dijit.byId("dlgOSIEstBox").show();
}

function fOSIArcUpdDo() {
	// Validacion de datos
	if (String(dijit.byId("txtOSI_EST_OBS").get("value")).length > 0) {
		if (!fValType("T", dijit.byId("txtOSI_EST_OBS").get("value"))) {
			fMsgBox("Las observaciones tienen caracteres inv&aacute;lidos.",
					"Validaci&oacute;n", "W");
			return;
		}
	} else {
		fMsgBox("Debe ingresar observaciones a modificar.",
				"Validaci&oacute;n", "W");
		return;
	}
	// Modificar
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("OperationService/setArchivoXSin");
		var vPar = "cache=" + fGetCacheRnd() + "&operacion="
				+ document.getElementById("txtOSI_SIN_NRO_OPE").operacion
				+ "&archivo="
				+ document.getElementById("txtOSI_ARC_TIP_ARC").archivo
				+ "&observaciones="
				+ fEncodeURI(dijit.byId("txtOSI_EST_OBS").get("value"));
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
						dijit.byId('dlgOSIEstBox').onCancel();
						fMsgBox("Modificaci&oacute;n exitosa!", "Exito", "O");
						fOSIArcCle();
						fOSISinDet();
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

function fOSISinDej() {
	if (fSessionValidate().pSft) {
		fOSISinDejExec();
	}
}

function fOSISinDejExec() {
	// ReadOnly
	document.getElementById("divOSISin").style.display = "inline";
	document.getElementById("divOSIArc").style.display = "none";
	fOSISinCle();
	fOSIArcROn(true);
	fOSIArcCle();
	fOSISinVol();
}

function fOSISinEst() {
	var ssn = fSessionValidate();
	if (ssn.pSft) {
		fOSISinEstExec(ssn.pSft, ssn.key, ssn.type);
	}
}

function fOSISinEstExec(vPeopleSoft, vProfileKey, vProfileType) {
	if (document.getElementById("txtOSI_SIN_DES_EST").estado == 3
			|| document.getElementById("txtOSI_SIN_DES_EST").estado == 6) {
		fMsgBox("El siniestro no se puede cambiar de estado.",
				"Validaci&oacute;n", "W");
		return;
	}
	if (vProfileKey != "S") {
		fMsgBox(
				"Su perfil no tiene permiso para realizar esta operaci&oacute;n.",
				"Validaci&oacute;n", "W");
		return;
	}
	fOSIParEstCbo("cboOSI_EST_COD", document
			.getElementById("txtOSI_SIN_DES_EST").estado);
	document.getElementById("hOSIEstFnc").value = "EST";
	document.getElementById("ttrOSIEstCod").style.display = "";
	document.getElementById("ttrOSIEstObs").style.display = "";
	dijit.byId("txtOSI_EST_OBS").set("value", "");
	dijit.byId("dlgOSIEstBox").set("title", "Cambiar estado");
	dijit.byId("dlgOSIEstBox").show();
}

function fOSIEstAce() {
	switch (document.getElementById("hOSIEstFnc").value) {
	case "ADE":
		fOSIArcDelDo();
		break;
	case "AUP":
		fOSIArcUpdDo();
		break;
	case "EST":
		fOSISinEstDo();
		break;
	default:
		// code block
	}
}

function fOSISinEstDo() {
	// Validacion de datos
	var vEstA = document.getElementById("txtOSI_SIN_DES_EST").estado;
	var vEst = "0";
	var vEstD = "";
	if (dijit.byId("cboOSI_EST_COD").get("value") == ""
			|| dijit.byId("cboOSI_EST_COD").get("value") == "0") {
		fMsgBox("Debe seleccionar un estado.", "Validaci&oacute;n", "W");
		return;
	} else {
		vEst = dijit.byId("cboOSI_EST_COD").get("value");
		vEstD = dijit.byId("cboOSI_EST_COD").get("displayedValue");
	}
	if (vEst == vEstA) {
		fMsgBox("El siniestro ya se encuentra en este estado.",
				"Validaci&oacute;n", "W");
		return;
	}
	if (String(dijit.byId("txtOSI_EST_OBS").get("value")).length > 0) {
		if (!fValType("T", dijit.byId("txtOSI_EST_OBS").get("value"))) {
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
		fQstBox("Est&aacute; seguro que desea anular el siniestro?" + "<br/>"
				+ "Esta operaci&oacute;n no podr&aacute; deshacerse.",
				"OSIEST", vEst, vEstD, dijit.byId("txtOSI_EST_OBS")
						.get("value"));
	} else {
		fOSISinSet(vEst, vEstD, dijit.byId("txtOSI_EST_OBS").get("value"));
	}
}

function fOSISinSet(vEstado, vEstadoDes, vObservaciones) {
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("OperationService/setSiniestro");
		var vPar = "cache=" + fGetCacheRnd() + "&operacion="
				+ document.getElementById("txtOSI_SIN_NRO_OPE").operacion
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
					dijit.byId('dlgOSIEstBox').onCancel();
					fMsgBox("Cambio de estado exitoso!", "Exito", "O");
					// Poner valores
					fOSISinSetVal(vEstado, vEstadoDes, vObservaciones);
					// Updatear Grilla
					dijit.byId("dgrOSISinLis").update();
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

function fOSISinSetVal(vEstado, vEstadoDes, vObservaciones) {
	// Pantalla
	document.getElementById("txtOSI_SIN_DES_EST").innerHTML = vEstadoDes;
	document.getElementById("txtOSI_SIN_DES_EST").estado = vEstado;
	document.getElementById("txtOSI_SIN_OBS_OPE").value = vObservaciones;
	// Deshabilitar botones si no es PENDIENTE
	if (vEstado != 5) {
		dijit.byId("btnOSISinEst").set("disabled", true);
		dijit.byId("btnOSIArcAdd").set("disabled", true);
		dijit.byId("btnOSIArcDel").set("disabled", true);
		dijit.byId("btnOSIArcUpd").set("disabled", true);
		document.getElementById("txtOSI_SIN_NRO_OPE").permiso = false;
	}
}

function fOSISinExl() {
	if (fSessionValidate().pSft) {
		fOSISinExlExec();
	}
}

function fOSISinExlExec() {
	// Excel
	window.open(fGetURLMVC("dwlExcelSinSvc.html?" + "cache=" + fGetCacheRnd()
			+ "&tipoExl=S" + fOSISinConPar()), "excelArc",
			"resizable=yes,height=700,width=900,top=100,left=100");
}