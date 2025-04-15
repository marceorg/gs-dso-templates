function onCCDLoad() {
	// Inicializar
	fCCDInitialize();
	// Tomar parametro
	var vParCiaCod = fGetParamURL("compania");
	var vParCiaDes = fGetParamURL("companiaDes");
	var vParPol = fGetParamURL("poliza");
	var vParEnd = fGetParamURL("endoso");
	document.getElementById("hidCCDCompaniaCod").value = vParCiaCod;
	document.getElementById("hidCCDCompaniaDes").value = vParCiaDes;
	document.getElementById("hidCCDPoliza").value = vParPol;
	document.getElementById("hidCCDEndoso").value = vParEnd;
	// Parametros para volver
	var vParTIn = fGetParamURL("tipoInforme");
	document.getElementById("hidCCDTipoInforme").value = vParTIn;
	if (vParTIn == "tipoInforme=COE") {
		var vParFDe = fGetParamURL("fechaDesde");
		var vParFHa = fGetParamURL("fechaHasta");
		var vParCia = fGetParamURL("companiaPar");
		var vParPro = fGetParamURL("producto");
		var vParPSt = fGetParamURL("paramStart");
		document.getElementById("hidCCDFechaDesde").value = vParFDe;
		document.getElementById("hidCCDFechaHasta").value = vParFHa;
		document.getElementById("hidCCDCompaniaPar").value = vParCia;
		document.getElementById("hidCCDProducto").value = vParPro;
		document.getElementById("hidCCDParamStart").value = vParPSt;
	} else if (vParTIn == "tipoInforme=CCL") {
		var vParTDo = fGetParamURL("tipDoc");
		var vParNDo = fGetParamURL("nroDoc");
		var vParApe = fGetParamURL("apellido");
		var vParCia = fGetParamURL("companiaPar");
		var vParPol = fGetParamURL("polizaPar");
		var vParPSt = fGetParamURL("paramStart");
		document.getElementById("hidCCDTipDoc").value = vParTDo;
		document.getElementById("hidCCDNroDoc").value = vParNDo;
		document.getElementById("hidCCDApellido").value = vParApe;
		document.getElementById("hidCCDCompaniaPar").value = vParCia;
		document.getElementById("hidCCDPolizaPar").value = vParPol;
		document.getElementById("hidCCDParamStart").value = vParPSt;
	}
	fSessionValidate("fCCDDataLoad");
}

function fCCDInitialize() {
	// Resize
	fBrowserResize();
}

function fCCDDataLoad() {
	// Espera
	fWaitMsgBoxIni("Consultando", [ "Consultando Cliente..." ]);

	// Consulta Clientes
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var url = fGetURLSvc("BSService/getConCliente?cache=" + fGetCacheRnd()
				+ "&" + document.getElementById("hidCCDCompaniaCod").value
				+ "&" + document.getElementById("hidCCDPoliza").value);
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

			var vJSONCon = response.result.contactoList;

			// Datos
			fCCDDataFill(vJSONDat);

			// Contactos
			var vData = {
				items : vJSONCon
			};
			var jsonDataSource = new ItemFileWriteStore({
				data : vData
			});

			var layout = [ [ {
				name : "Descripci&oacute;n",
				field : "descripcion",
				width : "250px"
			}, {
				name : "Medio",
				field : "medio",
				width : "250px"
			} ] ];

			if (dijit.byId("dgrCCDContList") == null) {
				oGrid = new DataGrid({
					id : "dgrCCDContList",
					store : jsonDataSource,
					structure : layout,
					rowSelector : "0px",
					rowCount : 20,
					autoHeight : true,
					autoWidth : true,
					style : 'width: 550px; height: 100px;',
					selectionMode : "single"
				}, "_divCCDContList");

				oGrid.startup();
			} else {
				dijit.byId("dgrCCDContList").setStructure(layout);
				dijit.byId("dgrCCDContList").setStore(jsonDataSource);
			}

			// Mensaje de exito
			fWaitMsgBoxUpd(0, "Cliente cargado.", "O");
			fWaitMsgBoxClose();
			dijit.byId("dlgWait").onCancel();

			dijit.byId("dgrCCDContList").update();

			fMnuDeselect();
		}, function(err) {
			fWaitMsgBoxUpd(0, "Se ha producido un error en la consulta.", "E");
			fWaitMsgBoxClose();
		});
	});
}

function fCCDDataFill(vJSONDat) {
	document.getElementById("txtCCDCompania").innerHTML = document
			.getElementById("hidCCDCompaniaDes").value.substr(12, 40);
	document.getElementById("txtCCDPoliza").innerHTML = document
			.getElementById("hidCCDPoliza").value.substr(7, 40);
	document.getElementById("txtCCDTomador").innerHTML = vJSONDat.tomador;
	document.getElementById("txtCCDDocumento").innerHTML = vJSONDat.tipDoc
			+ " " + vJSONDat.nroDoc;
	document.getElementById("txtCCDNacionalidad").innerHTML = fFormatClearSpaces(vJSONDat.nacionalidad);
	document.getElementById("txtCCDSexo").innerHTML = fDgrColSex(vJSONDat.sexo);
	document.getElementById("txtCCDFechaNacimiento").innerHTML = fDgrColFec(vJSONDat.fechaNacimiento);
	document.getElementById("txtCCDEstadoCivil").innerHTML = vJSONDat.estadoCivil;
	document.getElementById("txtCCDDomicilio").innerHTML = fFormatClearSpaces(vJSONDat.domicilio);
	document.getElementById("txtCCDCodPost").innerHTML = vJSONDat.codPost;
	document.getElementById("txtCCDLocalidad").innerHTML = vJSONDat.localidad;
	document.getElementById("txtCCDProvincia").innerHTML = vJSONDat.provincia;
}

function fCCDVolver() {
	fSessionValidate("fCCDBack");
}

function fCCDBack() {
	if (document.getElementById("hidCCDTipoInforme").value == "tipoInforme=COE") {
		url = fGetURLPag("interface/ConOpeEmitidas.html?"
				+ document.getElementById("hidCCDFechaDesde").value + "&"
				+ document.getElementById("hidCCDFechaHasta").value + "&"
				+ document.getElementById("hidCCDCompaniaPar").value + "&"
				+ document.getElementById("hidCCDProducto").value + "&"
				+ document.getElementById("hidCCDParamStart").value);
		var oCP = dijit.byId("divContent");
		oCP.set("href", url);
		oCP.set("onDownloadEnd", function() {
			onCOELoad();
		});
	} else if (document.getElementById("hidCCDTipoInforme").value == "tipoInforme=CCL") {
		url = fGetURLPag("interface/ConClientes.html?"
				+ document.getElementById("hidCCDTipDoc").value + "&"
				+ document.getElementById("hidCCDNroDoc").value + "&"
				+ document.getElementById("hidCCDApellido").value + "&"
				+ document.getElementById("hidCCDCompaniaPar").value + "&"
				+ document.getElementById("hidCCDPolizaPar").value + "&"
				+ document.getElementById("hidCCDParamStart").value);
		var oCP = dijit.byId("divContent");
		oCP.set("href", url);
		oCP.set("onDownloadEnd", function() {
			onCCLLoad();
		});
	}
}

function fCCDDetPol() {
	fSessionValidate('fCCDDetPolExec');
}

function fCCDDetPolExec() {
	url = fGetURLPag("interface/ConPolizaDet.html?"
			+ document.getElementById("hidCCDCompaniaCod").value + "&"
			+ document.getElementById("hidCCDCompaniaDes").value + "&"
			+ document.getElementById("hidCCDPoliza").value + "&"
			+ document.getElementById("hidCCDEndoso").value + "&"
			+ document.getElementById("hidCCDTipoInforme").value + "&"
			+ document.getElementById("hidCCDFechaDesde").value + "&"
			+ document.getElementById("hidCCDFechaHasta").value + "&"
			+ document.getElementById("hidCCDCompaniaPar").value + "&"
			+ document.getElementById("hidCCDProducto").value + "&"
			+ document.getElementById("hidCCDTipDoc").value + "&"
			+ document.getElementById("hidCCDNroDoc").value + "&"
			+ document.getElementById("hidCCDApellido").value + "&"
			+ document.getElementById("hidCCDPolizaPar").value + "&"
			+ document.getElementById("hidCCDParamStart").value);
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onCPDLoad();
	});

}