function onCSDLoad() {
	// Inicializar
	fCSDInitialize();
	// Tomar parametro
	var vParCia = fGetParamURL("compania");
	document.getElementById("hidCSDCompaniaCod").value = vParCia;
	var vParCiD = fGetParamURL("companiaDes");
	document.getElementById("hidCSDCompaniaDes").value = vParCiD;
	var vParSin = fGetParamURL("siniestro");
	document.getElementById("hidCSDSiniestro").value = vParSin;
	// Parametros para volver
	var vParTIn = fGetParamURL("tipoInforme");
	document.getElementById("hidCSDTipoInforme").value = vParTIn;
	if (vParTIn == "tipoInforme=CSI") {
		var vParFDe = fGetParamURL("fechaDesde");
		var vParFHa = fGetParamURL("fechaHasta");
		var vParCia = fGetParamURL("companiaPar");
		var vParTDo = fGetParamURL("tipDoc");
		var vParNDo = fGetParamURL("nroDoc");
		var vParApe = fGetParamURL("apellido");
		var vParPol = fGetParamURL("poliza");
		var vParSip = fGetParamURL("siniestroPar");
		var vParOrd = fGetParamURL("orden");
		var vParEst = fGetParamURL("estado");
		var vParPSt = fGetParamURL("paramStart");
		document.getElementById("hidCSDFechaDesde").value = vParFDe;
		document.getElementById("hidCSDFechaHasta").value = vParFHa;
		document.getElementById("hidCSDCompaniaPar").value = vParCia;
		document.getElementById("hidCSDTipDoc").value = vParTDo;
		document.getElementById("hidCSDNroDoc").value = vParNDo;
		document.getElementById("hidCSDApellido").value = vParApe;
		document.getElementById("hidCSDPoliza").value = vParPol;
		document.getElementById("hidCSDSiniestroPar").value = vParSip;
		document.getElementById("hidCSDOrden").value = vParOrd;
		document.getElementById("hidCSDEstado").value = vParEst;
		document.getElementById("hidCSDParamStart").value = vParPSt;
	}
	fSessionValidate("fCSDDataLoad");
}

function fCSDInitialize() {
	// Resize
	fBrowserResize();
}

function fCSDDataLoad() {
	// Espera
	fWaitMsgBoxIni("Consultando", [ "Consultando Siniestro..." ]);

	// Consulta Siniestro
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var url = fGetURLSvc("BSService/getConSiniestro?cache="
				+ fGetCacheRnd() + "&"
				+ document.getElementById("hidCSDCompaniaCod").value + "&"
				+ document.getElementById("hidCSDSiniestro").value);
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

			var vJSONCob = response.result.sinCoberturaList;
			var vJSONDet = response.result.sinDetalleList;
			var vJSONEst = response.result.sinEstadoList;
			var vJSONPag = response.result.sinPagoList;

			// Datos
			fCSDDataFill(vJSONDat);

			// Detalle
			if (vJSONDet.length > 0) {
				document.getElementById("hidCSDTieneDet").value = "S";

				var vDataDet = {
					items : vJSONDet
				};
				var jsonDSDet = new ItemFileWriteStore({
					data : vDataDet
				});

				var layout = [ [ {
					name : "Detalle o Documentacion Faltante",
					field : "descripcion",
					width : "280px"
				} ] ];

				if (dijit.byId("dgrCSDDetList") == null) {
					oGrid = new DataGrid({
						id : "dgrCSDDetList",
						store : jsonDSDet,
						structure : layout,
						rowSelector : "0px",
						rowCount : 20,
						autoHeight : true,
						autoWidth : true,
						style : 'width: 550px; height: 100px;',
						selectionMode : "single"
					}, "_divCSDDetList");

					oGrid.startup();
				} else {
					dijit.byId("dgrCSDDetList").setStructure(layout);
					dijit.byId("dgrCSDDetList").setStore(jsonDSDet);
				}
			}

			// Coberturas
			var vDataCob = {
				items : vJSONCob
			};
			var jsonDSCob = new ItemFileWriteStore({
				data : vDataCob
			});

			var layout = [ [ {
				name : "Cobertura",
				field : "descripcion",
				width : "400px"
			} ] ];

			if (dijit.byId("dgrCSDCobList") == null) {
				oGrid = new DataGrid({
					id : "dgrCSDCobList",
					store : jsonDSCob,
					structure : layout,
					rowSelector : "0px",
					rowCount : 20,
					autoHeight : true,
					autoWidth : true,
					style : 'width: 550px; height: 100px;',
					selectionMode : "single"
				}, "_divCSDCobList");

				oGrid.startup();
			} else {
				dijit.byId("dgrCSDCobList").setStructure(layout);
				dijit.byId("dgrCSDCobList").setStore(jsonDSCob);
			}

			// Estado
			var vDataEst = {
				items : vJSONEst
			};
			var jsonDSEst = new ItemFileWriteStore({
				data : vDataEst
			});

			var layout = [ [ {
				name : "Estado",
				field : "descripcion",
				width : "350px"
			}, {
				name : "Fecha",
				field : "fechaEstado",
				formatter : fDgrColFec,
				width : "100px"
			} ] ];

			if (dijit.byId("dgrCSDEstList") == null) {
				oGrid = new DataGrid({
					id : "dgrCSDEstList",
					store : jsonDSEst,
					structure : layout,
					rowSelector : "0px",
					rowCount : 20,
					autoHeight : true,
					autoWidth : true,
					style : 'width: 550px; height: 100px;',
					selectionMode : "single"
				}, "_divCSDEstList");

				oGrid.startup();
			} else {
				dijit.byId("dgrCSDEstList").setStructure(layout);
				dijit.byId("dgrCSDEstList").setStore(jsonDSEst);
			}

			// Pagos
			var vDataPag = {
				items : vJSONPag
			};
			var jsonDSPag = new ItemFileWriteStore({
				data : vDataPag
			});

			var layout = [ [ {
				name : "Detalle",
				field : "detalle",
				width : "200px"
			}, {
				name : "Beneficiario",
				field : "beneficiario",
				width : "300px"
			}, {
				name : "Importe",
				field : "importe",
				formatter : fDgrColDec,
				width : "100px"
			}, {
				name : "Fecha",
				field : "fechaPago",
				formatter : fDgrColFec,
				width : "100px"
			} ] ];

			if (dijit.byId("dgrCSDPagList") == null) {
				oGrid = new DataGrid({
					id : "dgrCSDPagList",
					store : jsonDSPag,
					structure : layout,
					rowSelector : "0px",
					rowCount : 20,
					autoHeight : true,
					autoWidth : true,
					style : 'width: 550px; height: 100px;',
					selectionMode : "single"
				}, "_divCSDPagList");

				oGrid.startup();
			} else {
				dijit.byId("dgrCSDPagList").setStructure(layout);
				dijit.byId("dgrCSDPagList").setStore(jsonDSEst);
			}

			// Mensaje de exito
			fWaitMsgBoxUpd(0, "Siniestro cargado", "O");
			fWaitMsgBoxClose();
			dijit.byId("dlgWait").onCancel();

			fMnuDeselect();
		}, function(err) {
			fWaitMsgBoxUpd(0, "Se ha producido un error en la consulta.", "E");
			fWaitMsgBoxClose();
		});
	});
}

function fCSDDataFill(vJSONDat) {
	// Datos principales
	document.getElementById("txtCSDCompania").innerHTML = document
			.getElementById("hidCSDCompaniaDes").value.substr(12, 40);
	document.getElementById("txtCSDPoliza").innerHTML = vJSONDat.poliza;
	document.getElementById("txtCSDTomador").innerHTML = vJSONDat.tomador;
	document.getElementById("txtCSDDocumento").innerHTML = vJSONDat.tipDoc
			+ " " + vJSONDat.nroDoc;
	document.getElementById("txtCSDVigencia").innerHTML = fDgrColFec(vJSONDat.vigenciaDesde)
			+ " - " + fDgrColFec(vJSONDat.vigenciaHasta);
	document.getElementById("txtCSDOrden").innerHTML = vJSONDat.orden;
	document.getElementById("txtCSDFechaRegistracion").innerHTML = fDgrColFec(vJSONDat.fechaRegistracion);
	document.getElementById("txtCSDSiniestro").innerHTML = document
			.getElementById("hidCSDSiniestro").value.substr(10, 30);
	document.getElementById("txtCSDFechaComunicacion").innerHTML = fDgrColFec(vJSONDat.fechaComunicacion);
	document.getElementById("txtCSDFechaSiniestro").innerHTML = fDgrColFec(vJSONDat.fechaSiniestro);
	document.getElementById("txtCSDLugar").innerHTML = vJSONDat.lugar;
	document.getElementById("txtCSDCausa").innerHTML = vJSONDat.causa;
	document.getElementById("txtCSDEstado").innerHTML = vJSONDat.estado;
	document.getElementById("txtCSDFechaEstado").innerHTML = fDgrColFec(vJSONDat.fechaEstado);
}

function fCSDVolver() {
	fSessionValidate("fCSDBack");
}

function fCSDBack() {
	if (document.getElementById("hidCSDTipoInforme").value == "tipoInforme=CSI") {
		url = fGetURLPag("interface/ConSiniestros.html?"
				+ document.getElementById("hidCSDFechaDesde").value + "&"
				+ document.getElementById("hidCSDFechaHasta").value + "&"
				+ document.getElementById("hidCSDCompaniaPar").value + "&"
				+ document.getElementById("hidCSDTipDoc").value + "&"
				+ document.getElementById("hidCSDNroDoc").value + "&"
				+ document.getElementById("hidCSDApellido").value + "&"
				+ document.getElementById("hidCSDPoliza").value + "&"
				+ document.getElementById("hidCSDSiniestroPar").value + "&"
				+ document.getElementById("hidCSDOrden").value + "&"
				+ document.getElementById("hidCSDEstado").value + "&"
				+ document.getElementById("hidCSDParamStart").value);
		var oCP = dijit.byId("divContent");
		oCP.set("href", url);
		oCP.set("onDownloadEnd", function() {
			onCSILoad();
		});
	}
}

function fCSDDetEst() {
	if (document.getElementById("hidCSDTieneDet").value == "S") {
		fSessionValidate('fCSDDetEstExec');
	} else {
		fMsgBox("No existe Detalle.", "Detalle", "W");
	}
}

function fCSDDetEstExec() {
	dijit.byId("dlgCSDDetalle").show();
}