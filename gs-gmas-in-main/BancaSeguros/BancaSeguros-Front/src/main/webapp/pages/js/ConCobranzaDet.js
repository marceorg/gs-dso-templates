function onCCELoad() {
	// Inicializar
	fCCEInitialize();
	// Tomar parametro
	var vParCia = fGetParamURL("compania");
	document.getElementById("hidCCECompaniaCod").value = vParCia;
	var vParCiD = fGetParamURL("companiaDes");
	document.getElementById("hidCCECompaniaDes").value = vParCiD;
	var vParPol = fGetParamURL("poliza");
	document.getElementById("hidCCEPoliza").value = vParPol;
	// Apellido y nombre del cliente, en cobranza se toma distinto.
	var vParAyN = fGetParamURL("apynom");
	document.getElementById("hidCCEApyNom").value = vParAyN;
	// Parametros para volver
	var vParTIn = fGetParamURL("tipoInforme");
	document.getElementById("hidCCETipoInforme").value = vParTIn;
	if (vParTIn == "tipoInforme=COE") {
		var vParFDe = fGetParamURL("fechaDesde");
		var vParFHa = fGetParamURL("fechaHasta");
		var vParCia = fGetParamURL("companiaPar");
		var vParPro = fGetParamURL("producto");
		var vParPSt = fGetParamURL("paramStart");
		document.getElementById("hidCCEFechaDesde").value = vParFDe;
		document.getElementById("hidCCEFechaHasta").value = vParFHa;
		document.getElementById("hidCCECompaniaPar").value = vParCia;
		document.getElementById("hidCCEProducto").value = vParPro;
		document.getElementById("hidCCEParamStart").value = vParPSt;
	} else if (vParTIn == "tipoInforme=CCL") {
		var vParTDo = fGetParamURL("tipDoc");
		var vParNDo = fGetParamURL("nroDoc");
		var vParApe = fGetParamURL("apellido");
		var vParCia = fGetParamURL("companiaPar");
		var vParPol = fGetParamURL("polizaPar");
		var vParPSt = fGetParamURL("paramStart");
		document.getElementById("hidCCETipDoc").value = vParTDo;
		document.getElementById("hidCCENroDoc").value = vParNDo;
		document.getElementById("hidCCEApellido").value = vParApe;
		document.getElementById("hidCCECompaniaPar").value = vParCia;
		document.getElementById("hidCCEPolizaPar").value = vParPol;
		document.getElementById("hidCCEParamStart").value = vParPSt;
	}
	fSessionValidate("fCCEDataLoad");
// Datos referenciales
	fCCEDataFill();
}

function fCCEInitialize() {
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
												.getElementById("hidCCEFechaHoy").value = response.result;
									}
								}, function(err) {
									vRet = false;
								});
			});
	// Setear valores
	dijit.byId("txtCCEFecDes").set(
			"value",
			fFormatDTB(fDateAdd(
					document.getElementById("hidCCEFechaHoy").value, -365)));
	dijit.byId("txtCCEFecHas").set("value",
			fFormatDTB(document.getElementById("hidCCEFechaHoy").value));
}

function fCCEDataLoad() {
	// Espera
	fWaitMsgBoxIni("Consultando", [ "Consultando Cobranza..." ]);

	// Obtengo las fechas
	var vFecDes = dojo.date.locale.format(dijit.byId("txtCCEFecDes").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtCCEFecHas").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});

	// Consulta Cobranza
	require(
			[ "dojo/request", "dojox/grid/DataGrid",
					"dojo/data/ItemFileWriteStore", "dojo/domReady!" ],
			function(request, DataGrid, ItemFileWriteStore) {
				var url = fGetURLSvc("BSService/getConCobranza?cache="
						+ fGetCacheRnd() + "&"
						+ document.getElementById("hidCCECompaniaCod").value
						+ "&" + document.getElementById("hidCCEPoliza").value
						+ "&fechaDesde=" + vFecDes + "&fechaHasta=" + vFecHas
						+ "&paramStart=");
				/*
				 * var url = fGetURLSvc("BSService/getConCobranza?cache=" +
				 * fGetCacheRnd() +
				 * "&compania=10&poliza=17-004-0-038277&fechaDesde=0&fechaHasta=0&paramStart=");
				 */
				var deferred = request.get(url, {
					handleAs : "json"
				});

				deferred
						.then(
								function(response) {
									// Manejar Respuesta
									if (response.error) {
										fWaitMsgBoxUpd(
												0,
												"Se ha producido un error en la consulta.",
												"E");
										fWaitMsgBoxClose();
										return;
									}

									var vJSONDat = response.result;

									// Si no trae nada
									if (vJSONDat == null
											|| !vJSONDat.jsonResult) {
										fWaitMsgBoxUpd(
												0,
												"Se ha producido un error en la consulta.",
												"E");
										fWaitMsgBoxClose();
										return;
									}

									var vJSONCob = fJSONParse(vJSONDat.jsonResult);

									if (vJSONCob == null
											|| vJSONCob.CANT == "0"
											|| vJSONCob.REGS.REG.length == 0) {
										fWaitMsgBoxUpd(
												0,
												"No se encontr&oacute; ning&uacute;n registro.",
												"W");
										fWaitMsgBoxClose();
										return;
									}

									// Datos
									// fCCEDataFill(vJSONDat);
									// Cobranza
									var vDataCob = {
										items : vJSONCob.REGS.REG
									};
									var jsonDSCob = new ItemFileWriteStore({
										data : vDataCob
									});

									var layout = [ [ {
										name : "Vigencia Desde",
										field : "VIGDDE",
										formatter : fDgrColFec,
										width : "80px"
									}, {
										name : "Vigencia Hasta",
										field : "VIGHTA",
										formatter : fDgrColFec,
										width : "80px"
									}, {
										name : "Nro. Recibo",
										field : "RECIBNUM",
										width : "120px"
									}, {
										name : "Fecha Vencimiento",
										field : "FECEMISI",
										formatter : fDgrColFec,
										width : "100px"
									}, {
										name : "Tipo",
										field : "TIPOCPBTE",
										width : "60px"
									}, {
										name : "Prima Neta",
										field : "IMPORTEPRIM",
										width : "100px"
									}, {
										name : "Total Recibo",
										field : "IMPORTEPREM",
										width : "100px"
									}, {
										name : "Estado",
										field : "ULTSITUA",
										width : "40px"
									}, {
										name : "Fec.Estado",
										field : "ULTSITFE",
										formatter : fDgrColFec,
										width : "80px"
									} ] ];

									if (dijit.byId("dgrCCECobList") == null) {
										oGrid = new DataGrid(
												{
													id : "dgrCCECobList",
													store : jsonDSCob,
													structure : layout,
													rowSelector : "20px",
													rowCount : 20,
													style : 'width: 900px; height: 100px;',
													selectionMode : "single"
												}, "_divCCECobList");

										oGrid.startup();
									} else {
										dijit.byId("dgrCCECobList")
												.setStructure(layout);
										dijit.byId("dgrCCECobList").setStore(
												jsonDSCob);
									}

									if (vJSONCob.REGS.REG.length > 0
											&& vJSONCob.REGS.REG.length <= 12) {
										dijit.byId("dgrCCECobList").set(
												"autoHeight", true);
									} else if (vJSONCob.REGS.REG.length > 12) {
										dijit.byId("dgrCCECobList").set(
												"autoHeight", false);
										dijit.byId("dgrCCECobList").set(
												"style",
												"width: 900px; height: 300px;");
									} else {
										dijit.byId("dgrCCECobList").set(
												"autoHeight", false);
										dijit.byId("dgrCCECobList").set(
												"style",
												"width: 900px; height: 50px;");
									}

									// Mensaje de exito
									fWaitMsgBoxUpd(0, "Cobranzas cargadas.",
											"O");
									fWaitMsgBoxClose();
									dijit.byId("dlgWait").onCancel();

									fMnuDeselect();
								},
								function(err) {
									fWaitMsgBoxUpd(
											0,
											"Se ha producido un error en la consulta.",
											"E");
									fWaitMsgBoxClose();
								});
			});
}

// function fCCEDataFill(vJSONDat) {
function fCCEDataFill() {
	// Datos principales
	document.getElementById("txtCCECompania").innerHTML = document
			.getElementById("hidCCECompaniaDes").value.substr(12, 40);
	/*
	 * document.getElementById("txtCCEProducto").innerHTML =
	 * vJSONDat.producto.id + " " + vJSONDat.producto.name;
	 * document.getElementById("txtCCESucursal").innerHTML =
	 * vJSONDat.sucursal.id + " " + vJSONDat.sucursal.name;
	 * document.getElementById("txtCCECanal").innerHTML = vJSONDat.canal.id + " " +
	 * vJSONDat.canal.name;
	 */
	document.getElementById("txtCCEPoliza").innerHTML = document
			.getElementById("hidCCEPoliza").value.substr(7, 40);
	/*
	 * document.getElementById("txtCCEFechaEmision").innerHTML =
	 * fDgrColFec(vJSONDat.fechaEmision);
	 * document.getElementById("txtCCEEstado").innerHTML = vJSONDat.estado;
	 * document.getElementById("txtCCETomador").innerHTML = vJSONDat.tomador;
	 * document.getElementById("txtCCEDocumento").innerHTML = vJSONDat.tipDoc + " " +
	 * vJSONDat.nroDoc; document.getElementById("txtCCEVendedor").innerHTML =
	 * vJSONDat.vendedorLegajo + " " + vJSONDat.vendedorNombre;
	 */
	document.getElementById("txtCCETomador").innerHTML = document
			.getElementById("hidCCEApyNom").value.substr(7, 40);
}

function fCCEVolver() {
	fSessionValidate("fCCEBack");
}

function fCCEBack() {
	if (document.getElementById("hidCCETipoInforme").value == "tipoInforme=COE") {
		url = fGetURLPag("interface/ConOpeEmitidas.html?"
				+ document.getElementById("hidCCEFechaDesde").value + "&"
				+ document.getElementById("hidCCEFechaHasta").value + "&"
				+ document.getElementById("hidCCECompaniaPar").value + "&"
				+ document.getElementById("hidCCEProducto").value + "&"
				+ document.getElementById("hidCCEParamStart").value);
		var oCP = dijit.byId("divContent");
		oCP.set("href", url);
		oCP.set("onDownloadEnd", function() {
			onCOELoad();
		});
	} else if (document.getElementById("hidCCETipoInforme").value == "tipoInforme=CCL") {
		url = fGetURLPag("interface/ConClientes.html?"
				+ document.getElementById("hidCCETipDoc").value + "&"
				+ document.getElementById("hidCCENroDoc").value + "&"
				+ document.getElementById("hidCCEApellido").value + "&"
				+ document.getElementById("hidCCECompaniaPar").value + "&"
				+ document.getElementById("hidCCEPolizaPar").value + "&"
				+ document.getElementById("hidCCEParamStart").value);
		var oCP = dijit.byId("divContent");
		oCP.set("href", url);
		oCP.set("onDownloadEnd", function() {
			onCCLLoad();
		});
	}
}

function fCCEBuscar() {
	fSessionValidate('fCCEBuscarExec');
}

function fCCEBuscarExec() {
	// Validacion
	if (dijit.byId("txtCCEFecDes").get("value") == null) {
		fMsgBox("Fecha desde inv&aacute;lida.", "Validaci&oacute;n", "E");
		return;
	}
	if (dijit.byId("txtCCEFecHas").get("value") == null) {
		fMsgBox("Fecha hasta inv&aacute;lida.", "Validaci&oacute;n", "E");
		return;
	}

	// Obtengo las fechas
	var vFecDes = dojo.date.locale.format(dijit.byId("txtCCEFecDes").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtCCEFecHas").get(
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
	if (vFecHas > document.getElementById("hidCCEFechaHoy").value) {
		fMsgBox("La fecha hasta no debe ser mayor a la fecha actual.",
				"Validaci&oacute;n", "E");
		return;
	}

	// Cargar Lista
	fSessionValidate('fCCEDataLoad');
}