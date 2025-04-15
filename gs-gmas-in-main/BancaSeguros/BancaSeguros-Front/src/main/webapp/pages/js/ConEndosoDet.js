function onCEDLoad() {
	// Inicializar
	fCEDInitialize();
	// Tomar parametro
	var vParCia = fGetParamURL("compania");
	document.getElementById("hidCEDCompaniaCod").value = vParCia;
	var vParCiD = fGetParamURL("companiaDes");
	document.getElementById("hidCEDCompaniaDes").value = vParCiD;
	var vParPol = fGetParamURL("poliza");
	document.getElementById("hidCEDPoliza").value = vParPol;
	// Parametros para volver
	var vParTIn = fGetParamURL("tipoInforme");
	document.getElementById("hidCEDTipoInforme").value = vParTIn;
	if (vParTIn == "tipoInforme=COE") {
		var vParFDe = fGetParamURL("fechaDesde");
		var vParFHa = fGetParamURL("fechaHasta");
		var vParCia = fGetParamURL("companiaPar");
		var vParPro = fGetParamURL("producto");
		var vParPSt = fGetParamURL("paramStart");
		document.getElementById("hidCEDFechaDesde").value = vParFDe;
		document.getElementById("hidCEDFechaHasta").value = vParFHa;
		document.getElementById("hidCEDCompaniaPar").value = vParCia;
		document.getElementById("hidCEDProducto").value = vParPro;
		document.getElementById("hidCEDParamStart").value = vParPSt;
	} else if (vParTIn == "tipoInforme=CCL") {
		var vParTDo = fGetParamURL("tipDoc");
		var vParNDo = fGetParamURL("nroDoc");
		var vParApe = fGetParamURL("apellido");
		var vParCia = fGetParamURL("companiaPar");
		var vParPol = fGetParamURL("polizaPar");
		var vParPSt = fGetParamURL("paramStart");
		document.getElementById("hidCEDTipDoc").value = vParTDo;
		document.getElementById("hidCEDNroDoc").value = vParNDo;
		document.getElementById("hidCEDApellido").value = vParApe;
		document.getElementById("hidCEDCompaniaPar").value = vParCia;
		document.getElementById("hidCEDPolizaPar").value = vParPol;
		document.getElementById("hidCEDParamStart").value = vParPSt;
	}
	fSessionValidate("fCEDDataLoad");
}

function fCEDInitialize() {
	// Resize
	fBrowserResize();
	// Fecha Hoy
	require(
			[ "dojo/request", "dojo/domReady!" ],
			function(request) {
				var vURL = fGetURLSvc("ParametersService/getFechaHoy");
				var deferred = request.get(vURL, {
					handleAs : "json",
					sync : true
				});
				deferred
						.then(
								function(response) {
									if (response.error) {
										vRet = false;
									} else {
										document
												.getElementById("hidCEDFechaHoy").value = response.result;
									}
								}, function(err) {
									vRet = false;
								});
			});
	// Setear valores
	dijit.byId("txtCEDFecDes").set(
			"value",
			fFormatDTB(fDateAdd(
					document.getElementById("hidCEDFechaHoy").value, -365)));
	dijit.byId("txtCEDFecHas").set("value",
			fFormatDTB(document.getElementById("hidCEDFechaHoy").value));
}

function fCEDDataLoad() {
	// Espera
	fWaitMsgBoxIni("Consultando", [ "Consultando Endosos..." ]);

	// Obtengo las fechas
	var vFecDes = dojo.date.locale.format(dijit.byId("txtCEDFecDes").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtCEDFecHas").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});

	// Consulta Endosos
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var url = fGetURLSvc("BSService/getConEndoso?cache=" + fGetCacheRnd()
				+ "&" + document.getElementById("hidCEDCompaniaCod").value
				+ "&" + document.getElementById("hidCEDPoliza").value
				+ "&fechaDesde=" + vFecDes + "&fechaHasta=" + vFecHas);
		var deferred = request.get(url, {
			handleAs : "json"
		});

		deferred.then(function(response) {
			// Manejar Respuesta
			if (response.error) {
				fWaitMsgBoxUpd(0, "Se ha producido un error en la consulta.",
						"E");
				fWaitMsgBoxClose();
				return;
			}

			var vJSONDat = response.result;

			// Si no trae nada
			if (vJSONDat == null || vJSONDat.length == 0) {
				fWaitMsgBoxUpd(0,
						"No se encontr&oacute; ning&uacute;n registro.", "W");
				fWaitMsgBoxClose();
				return;
			}

			var vJSONEnd = response.result.endosoList;

			// Datos
			fCEDDataFill(vJSONDat);

			// Endosos
			var vDataEnd = {
				items : vJSONEnd
			};
			var jsonDSEnd = new ItemFileWriteStore({
				data : vDataEnd
			});

			var layout = [ [ {
				name : "Endoso",
				field : "endoso",
				width : "60px"
			}, {
				name : "Vigencia Desde",
				field : "vigenciaDesde",
				formatter : fDgrColFec,
				width : "95px"
			}, {
				name : "Vigencia Hasta",
				field : "vigenciaHasta",
				formatter : fDgrColFec,
				width : "95px"
			}, {
				name : "Motivo",
				field : "motivo",
				width : "410px"
			} ] ];

			if (dijit.byId("dgrCEDEndList") == null) {
				oGrid = new DataGrid({
					id : "dgrCEDEndList",
					store : jsonDSEnd,
					structure : layout,
					rowSelector : "20px",
					rowCount : 20,
					style : 'width: 750px; height: 100px;',
					selectionMode : "single"
				}, "_divCEDEndList");

				oGrid.startup();
			} else {
				dijit.byId("dgrCEDEndList").setStructure(layout);
				dijit.byId("dgrCEDEndList").setStore(jsonDSEnd);
			}

			if (vJSONEnd.length > 0) {
				dijit.byId("dgrCEDEndList").set("autoHeight", true);
			} else {
				dijit.byId("dgrCEDEndList").set("autoHeight", false);
				dijit.byId("dgrCEDEndList").set("style",
						"width: 750px; height: 100px;");
			}

			// Mensaje de exito
			fWaitMsgBoxUpd(0, "Endosos cargados.", "O");
			fWaitMsgBoxClose();
			dijit.byId("dlgWait").onCancel();

			fMnuDeselect();
		}, function(err) {
			fWaitMsgBoxUpd(0, "Se ha producido un error en la consulta.", "E");
			fWaitMsgBoxClose();
		});
	});
}

function fCEDDataFill(vJSONDat) {
	// Datos principales
	document.getElementById("txtCEDCompania").innerHTML = document
			.getElementById("hidCEDCompaniaDes").value.substr(12, 40);
	document.getElementById("txtCEDProducto").innerHTML = vJSONDat.producto.id
			+ " " + vJSONDat.producto.name;
	document.getElementById("txtCEDSucursal").innerHTML = vJSONDat.sucursal.id
			+ " " + vJSONDat.sucursal.name;
	document.getElementById("txtCEDCanal").innerHTML = vJSONDat.canal.id + " "
			+ vJSONDat.canal.name;
	document.getElementById("txtCEDPoliza").innerHTML = document
			.getElementById("hidCEDPoliza").value.substr(7, 40);
	document.getElementById("txtCEDFechaEmision").innerHTML = fDgrColFec(vJSONDat.fechaEmision);
	document.getElementById("txtCEDEstado").innerHTML = vJSONDat.estado;
	document.getElementById("txtCEDTomador").innerHTML = vJSONDat.tomador;
	document.getElementById("txtCEDDocumento").innerHTML = vJSONDat.tipDoc
			+ " " + vJSONDat.nroDoc;
	document.getElementById("txtCEDVendedor").innerHTML = vJSONDat.vendedorLegajo
			+ " " + vJSONDat.vendedorNombre;
}

function fCEDVolver() {
	fSessionValidate("fCEDBack");
}

function fCEDBack() {
	if (document.getElementById("hidCEDTipoInforme").value == "tipoInforme=COE") {
		url = fGetURLPag("interface/ConOpeEmitidas.html?"
				+ document.getElementById("hidCEDFechaDesde").value + "&"
				+ document.getElementById("hidCEDFechaHasta").value + "&"
				+ document.getElementById("hidCEDCompaniaPar").value + "&"
				+ document.getElementById("hidCEDProducto").value + "&"
				+ document.getElementById("hidCEDParamStart").value);
		var oCP = dijit.byId("divContent");
		oCP.set("href", url);
		oCP.set("onDownloadEnd", function() {
			onCOELoad();
		});
	} else if (document.getElementById("hidCEDTipoInforme").value == "tipoInforme=CCL") {
		url = fGetURLPag("interface/ConClientes.html?"
				+ document.getElementById("hidCEDTipDoc").value + "&"
				+ document.getElementById("hidCEDNroDoc").value + "&"
				+ document.getElementById("hidCEDApellido").value + "&"
				+ document.getElementById("hidCEDCompaniaPar").value + "&"
				+ document.getElementById("hidCEDPolizaPar").value + "&"
				+ document.getElementById("hidCEDParamStart").value);
		var oCP = dijit.byId("divContent");
		oCP.set("href", url);
		oCP.set("onDownloadEnd", function() {
			onCCLLoad();
		});
	}
}

function fCEDDetPol() {
	fSessionValidate('fCEDDetPolExec');
}

function fCEDDetPolExec() {
	var oGrid = dijit.byId("dgrCEDEndList");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un endoso.", "Advertencia", "W");
		return;
	}

	url = fGetURLPag("interface/ConPolizaDet.html?"
			+ document.getElementById("hidCEDCompaniaCod").value + "&"
			+ document.getElementById("hidCEDCompaniaDes").value + "&"
			+ document.getElementById("hidCEDPoliza").value + "&endoso="
			+ oItems[0].endoso + "&"
			+ document.getElementById("hidCEDTipoInforme").value + "&"
			+ document.getElementById("hidCEDFechaDesde").value + "&"
			+ document.getElementById("hidCEDFechaHasta").value + "&"
			+ document.getElementById("hidCEDCompaniaPar").value + "&"
			+ document.getElementById("hidCEDProducto").value + "&"
			+ document.getElementById("hidCEDTipDoc").value + "&"
			+ document.getElementById("hidCEDNroDoc").value + "&"
			+ document.getElementById("hidCEDApellido").value + "&"
			+ document.getElementById("hidCEDPolizaPar").value + "&"
			+ document.getElementById("hidCEDParamStart").value);
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onCPDLoad();
	});
}

function fCEDBuscar() {
	fSessionValidate('fCEDBuscarExec');
}

function fCEDBuscarExec() {
	// Validacion
	if (dijit.byId("txtCEDFecDes").get("value") == null) {
		fMsgBox("Fecha desde inv&aacute;lida.", "Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("txtCEDFecHas").get("value") == null) {
		fMsgBox("Fecha hasta inv&aacute;lida.", "Validaci&oacute;n", "E");
		return;
	}

	// Obtengo las fechas
	var vFecDes = dojo.date.locale.format(dijit.byId("txtCEDFecDes").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtCEDFecHas").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});

	// Rango
	if (vFecHas < vFecDes) {
		fMsgBox("La fecha hasta debe ser mayor o igual a la fecha desde.",
				"Validaci&oacute;n", "E");
		return;
	}
	if (vFecHas > document.getElementById("hidCEDFechaHoy").value) {
		fMsgBox("La fecha hasta no debe ser mayor a la fecha actual.",
				"Validaci&oacute;n", "E");
		return;
	}

	// Cargar Lista
	fSessionValidate('fCEDDataLoad');
}