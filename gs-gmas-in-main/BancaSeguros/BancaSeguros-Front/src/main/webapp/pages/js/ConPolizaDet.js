function onCPDLoad() {
	// Inicializar
	fCPDInitialize();
	// Tomar parametro
	var vParCia = fGetParamURL("compania");
	document.getElementById("hidCPDCompaniaCod").value = vParCia;
	var vParCiD = fGetParamURL("companiaDes");
	document.getElementById("hidCPDCompaniaDes").value = vParCiD;
	var vParPol = fGetParamURL("poliza");
	document.getElementById("hidCPDPoliza").value = vParPol;
	var vParEnd = fGetParamURL("endoso");
	document.getElementById("hidCPDEndoso").value = vParEnd;
	// Parametros para volver
	var vParTIn = fGetParamURL("tipoInforme");
	document.getElementById("hidCPDTipoInforme").value = vParTIn;
	if (vParTIn == "tipoInforme=COE") {
		var vParFDe = fGetParamURL("fechaDesde");
		var vParFHa = fGetParamURL("fechaHasta");
		var vParCia = fGetParamURL("companiaPar");
		var vParPro = fGetParamURL("producto");
		var vParPSt = fGetParamURL("paramStart");
		document.getElementById("hidCPDFechaDesde").value = vParFDe;
		document.getElementById("hidCPDFechaHasta").value = vParFHa;
		document.getElementById("hidCPDCompaniaPar").value = vParCia;
		document.getElementById("hidCPDProducto").value = vParPro;
		document.getElementById("hidCPDParamStart").value = vParPSt;
	} else if (vParTIn == "tipoInforme=CCL") {
		var vParTDo = fGetParamURL("tipDoc");
		var vParNDo = fGetParamURL("nroDoc");
		var vParApe = fGetParamURL("apellido");
		var vParCia = fGetParamURL("companiaPar");
		var vParPol = fGetParamURL("polizaPar");
		var vParPSt = fGetParamURL("paramStart");
		document.getElementById("hidCPDTipDoc").value = vParTDo;
		document.getElementById("hidCPDNroDoc").value = vParNDo;
		document.getElementById("hidCPDApellido").value = vParApe;
		document.getElementById("hidCPDCompaniaPar").value = vParCia;
		document.getElementById("hidCPDPolizaPar").value = vParPol;
		document.getElementById("hidCPDParamStart").value = vParPSt;
	}
	fSessionValidate("fCPDDataLoad");
}

function fCPDInitialize() {
	// Resize
	fBrowserResize();
}

function fCPDDataLoad() {
	// Espera
	fWaitMsgBoxIni("Consultando", [ "Consultando P&oacute;liza..." ]);

	// Consulta Poliza
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var url = fGetURLSvc("BSService/getConPoliza?cache=" + fGetCacheRnd()
				+ "&" + document.getElementById("hidCPDCompaniaCod").value
				+ "&" + document.getElementById("hidCPDPoliza").value + "&"
				+ document.getElementById("hidCPDEndoso").value);
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

			var vJSONAseAdi = response.result.asegAdicList;
			var vJSONBen = response.result.beneficiarioList;
			var vJSONCob = response.result.coberturaList;
			var vJSONRie = response.result.riesgoList;

			// Datos
			fCPDDataFill(vJSONDat);

			// Asegurados Adicionales
			var vDataAseAdi = {
				items : vJSONAseAdi
			};
			var jsonDSAseAdi = new ItemFileWriteStore({
				data : vDataAseAdi
			});

			var layout = [ [ {
				name : "Apellido y Nombre",
				field : "nombre",
				width : "250px"
			}, {
				name : "Tipo y Nro. de Documento",
				fields : [ "tipDoc", "nroDoc" ],
				formatter : fDgrColTND,
				width : "250px"
			} ] ];

			if (dijit.byId("dgrCPDAseAdiList") == null) {
				oGrid = new DataGrid({
					id : "dgrCPDAseAdiList",
					store : jsonDSAseAdi,
					structure : layout,
					rowSelector : "0px",
					rowCount : 20,
					autoHeight : true,
					autoWidth : true,
					style : 'width: 550px; height: 100px;',
					selectionMode : "single"
				}, "_divCPDAseAdiList");

				oGrid.startup();
			} else {
				dijit.byId("dgrCPDAseAdiList").setStructure(layout);
				dijit.byId("dgrCPDAseAdiList").setStore(jsonDSAseAdi);
			}

			if (vJSONAseAdi.length == 0) {
				document.getElementById("trCPDAseAdiLeye").style.display = "";
			} else {
				document.getElementById("trCPDAseAdiGrid").style.display = "";
				dijit.byId("dgrCPDAseAdiList").update();
			}

			// Beneficiarios
			var vDataBen = {
				items : vJSONBen
			};
			var jsonDSBen = new ItemFileWriteStore({
				data : vDataBen
			});

			var layout = [ [ {
				name : "Orden",
				field : "orden",
				width : "50px"
			}, {
				name : "Apellido y Nombre",
				field : "nombre",
				width : "250px"
			}, {
				name : "Tipo y Nro. de Documento",
				fields : [ "tipDoc", "nroDoc" ],
				formatter : fDgrColTND,
				width : "250px"
			}, {
				name : "% Capital",
				field : "porcentaje",
				width : "50px"
			} ] ];

			if (dijit.byId("dgrCPDBenList") == null) {
				oGrid = new DataGrid({
					id : "dgrCPDBenList",
					store : jsonDSBen,
					structure : layout,
					rowSelector : "0px",
					rowCount : 20,
					autoHeight : true,
					autoWidth : true,
					style : 'width: 550px; height: 100px;',
					selectionMode : "single"
				}, "_divCPDBenList");

				oGrid.startup();
			} else {
				dijit.byId("dgrCPDBenList").setStructure(layout);
				dijit.byId("dgrCPDBenList").setStore(jsonDSBen);
			}

			if (vJSONBen.length == 0) {
				document.getElementById("trCPDBenGrid").style.display = "none";
			} else {
				document.getElementById("trCPDBenGrid").style.display = "";
				dijit.byId("dgrCPDBenList").update();
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
			}, {
				name : "Suma Asegurada",
				field : "sumaAseg",
				formatter : fDgrColDec,
				width : "100px",
				styles : 'text-align: right;'
			} ] ];

			if (dijit.byId("dgrCPDCobList") == null) {
				oGrid = new DataGrid({
					id : "dgrCPDCobList",
					store : jsonDSCob,
					structure : layout,
					rowSelector : "0px",
					rowCount : 20,
					autoHeight : true,
					autoWidth : true,
					style : 'width: 550px; height: 100px;',
					selectionMode : "single"
				}, "_divCPDCobList");

				oGrid.startup();
			} else {
				dijit.byId("dgrCPDCobList").setStructure(layout);
				dijit.byId("dgrCPDCobList").setStore(jsonDSCob);
			}

			// Riesgos
			var vDataRie = {
				items : vJSONRie
			};
			var jsonDSRie = new ItemFileWriteStore({
				data : vDataRie
			});

			var layout = [ [ {
				name : "Tipo de Riesgo",
				field : "descripcion",
				width : "250px"
			}, {
				name : "Descripci&oacute;n",
				field : "contenido",
				width : "550px"
			} ] ];

			if (dijit.byId("dgrCPDRieList") == null) {
				oGrid = new DataGrid({
					id : "dgrCPDRieList",
					store : jsonDSRie,
					structure : layout,
					rowSelector : "0px",
					rowCount : 20,
					autoHeight : true,
					autoWidth : true,
					style : 'width: 550px; height: 100px;',
					selectionMode : "single"
				}, "_divCPDRieList");

				oGrid.startup();
			} else {
				dijit.byId("dgrCPDRieList").setStructure(layout);
				dijit.byId("dgrCPDRieList").setStore(jsonDSRie);
			}

			// Mensaje de exito
			fWaitMsgBoxUpd(0, "P&oacute;liza cargada.", "O");
			fWaitMsgBoxClose();
			dijit.byId("dlgWait").onCancel();

			fMnuDeselect();
		}, function(err) {
			fWaitMsgBoxUpd(0, "Se ha producido un error en la consulta.", "E");
			fWaitMsgBoxClose();
		});
	});
}

function fCPDDataFill(vJSONDat) {
	// Datos principales
	document.getElementById("txtCPDCompania").innerHTML = document
			.getElementById("hidCPDCompaniaDes").value.substr(12, 40);
	document.getElementById("txtCPDProducto").innerHTML = vJSONDat.producto.id
			+ " " + vJSONDat.producto.name;
	document.getElementById("txtCPDSucursal").innerHTML = vJSONDat.sucursal.id
			+ " " + vJSONDat.sucursal.name;
	document.getElementById("txtCPDCanal").innerHTML = vJSONDat.canal.id + " "
			+ vJSONDat.canal.name;
	document.getElementById("txtCPDPoliza").innerHTML = document
			.getElementById("hidCPDPoliza").value.substr(7, 40);
	document.getElementById("txtCPDEndoso").innerHTML = document
			.getElementById("hidCPDEndoso").value.substr(7, 40);
	document.getElementById("txtCPDFechaEmision").innerHTML = fDgrColFec(vJSONDat.fechaEmision);
	document.getElementById("txtCPDEstado").innerHTML = vJSONDat.estado;
	document.getElementById("txtCPDTomador").innerHTML = vJSONDat.tomador;
	document.getElementById("txtCPDDocumento").innerHTML = vJSONDat.tipDoc
			+ " " + vJSONDat.nroDoc;
	document.getElementById("txtCPDVendedor").innerHTML = vJSONDat.vendedorLegajo
			+ " " + vJSONDat.vendedorNombre;
	// Datos de p�liza
	document.getElementById("txtCPDOrden").innerHTML = vJSONDat.orden;
	document.getElementById("txtCPDPremio").innerHTML = vJSONDat.premio;
	document.getElementById("txtCPDFechaRegistracion").innerHTML = fDgrColFec(vJSONDat.fechaRegistracion);
	document.getElementById("txtCPDVigencia").innerHTML = fDgrColFec(vJSONDat.vigenciaDesde)
			+ " - " + fDgrColFec(vJSONDat.vigenciaHasta);
	document.getElementById("txtCPDCampana").innerHTML = vJSONDat.campana;
	document.getElementById("txtCPDCanalCobro").innerHTML = vJSONDat.canalCobro;
	document.getElementById("txtCPDTipCta").innerHTML = vJSONDat.tipCta;
	document.getElementById("txtCPDNroCta").innerHTML = vJSONDat.nroCta;
	// Datos del Asegurado
	document.getElementById("txtCPDAseNombre").innerHTML = vJSONDat.asegurado.nombre;
	document.getElementById("txtCPDAseDocumento").innerHTML = vJSONDat.asegurado.tipDoc
			+ " " + vJSONDat.asegurado.nroDoc;
	document.getElementById("txtCPDAseDomicilio").innerHTML = fFormatClearSpaces(vJSONDat.asegurado.domicilio);
	document.getElementById("txtCPDAseCodPost").innerHTML = vJSONDat.asegurado.codPost;
	document.getElementById("txtCPDAseLocalidad").innerHTML = vJSONDat.asegurado.localidad;
	document.getElementById("txtCPDAseProvincia").innerHTML = vJSONDat.asegurado.provincia;
	// Leyenda Beneficiarios
	document.getElementById("txtCPDLeyeBenef").innerHTML = vJSONDat.leyeBeneficiario;
	// Para uso cobranzas
	document.getElementById("hidCPDEApyNom").value = vJSONDat.tomador;
}

function fCPDVolver() {
	fSessionValidate("fCPDBack");
}

function fCPDBack() {
	if (document.getElementById("hidCPDTipoInforme").value == "tipoInforme=COE") {
		url = fGetURLPag("interface/ConOpeEmitidas.html?"
				+ document.getElementById("hidCPDFechaDesde").value + "&"
				+ document.getElementById("hidCPDFechaHasta").value + "&"
				+ document.getElementById("hidCPDCompaniaPar").value + "&"
				+ document.getElementById("hidCPDProducto").value + "&"
				+ document.getElementById("hidCPDParamStart").value);
		var oCP = dijit.byId("divContent");
		oCP.set("href", url);
		oCP.set("onDownloadEnd", function() {
			onCOELoad();
		});
	} else if (document.getElementById("hidCPDTipoInforme").value == "tipoInforme=CCL") {
		url = fGetURLPag("interface/ConClientes.html?"
				+ document.getElementById("hidCPDTipDoc").value + "&"
				+ document.getElementById("hidCPDNroDoc").value + "&"
				+ document.getElementById("hidCPDApellido").value + "&"
				+ document.getElementById("hidCPDCompaniaPar").value + "&"
				+ document.getElementById("hidCPDPolizaPar").value + "&"
				+ document.getElementById("hidCPDParamStart").value);
		var oCP = dijit.byId("divContent");
		oCP.set("href", url);
		oCP.set("onDownloadEnd", function() {
			onCCLLoad();
		});
	}
}

function fCPDDetPDF() {
	fSessionValidate('fCPDDetPDFExec');
}

function fCPDDetPDFExec() {
	if (document.getElementById("hidCPDCompaniaCod").value == 'compania=1') {
		var vEndoso = fFormatFill(document.getElementById("hidCPDEndoso").value
				.substring(7, 11), 4, "0");
		var vPoliza = document.getElementById("hidCPDPoliza").value.substring(
				7, 50)
		if (document.getElementById("hidCPDPoliza").value.substring(7, 11) == 'AUS1') {
			// orden=0 pza.qbe orden=2 mercosur.qbe
			document.getElementById("hQBEBoxFnc").value = "fQBEImprimeQBE ('"
					+ vPoliza + "','" + vEndoso + "'";
			fQBEBox("Seleccione el impreso que desea obtener");
		} else {
			fQBEImprimeQBE(vPoliza, vEndoso, 0);
		}
	} else if (document.getElementById("hidCPDCompaniaCod").value == 'compania=20') {
		window.open(fGetURLMVC("retrieveSvc.html?"
				+ "cache="
				+ fGetCacheRnd()
				+ "&tipo=P&"
				+ "orden=1&"
				+ document.getElementById("hidCPDPoliza").value
				+ "-"
				+ fFormatFill(document.getElementById("hidCPDEndoso").value
						.substring(7, 11), 4, "0")), "retrieve",
				"resizable=yes,height=550,width=750,top=50,left=100");
	} else {
		fMsgBox(
				"La Compa&ntilde;&iacute;a no tiene servicio de impresi&oacute;n",
				"Advertencia", "W");
	}
}

function fCPDDetCli() {
	fSessionValidate('fCPDDetCliExec');
}

function fCPDDetCliExec() {
	url = fGetURLPag("interface/ConClienteDet.html?"
			+ document.getElementById("hidCPDCompaniaCod").value + "&"
			+ document.getElementById("hidCPDCompaniaDes").value + "&"
			+ document.getElementById("hidCPDPoliza").value + "&"
			+ document.getElementById("hidCPDEndoso").value + "&"
			+ document.getElementById("hidCPDTipoInforme").value + "&"
			+ document.getElementById("hidCPDFechaDesde").value + "&"
			+ document.getElementById("hidCPDFechaHasta").value + "&"
			+ document.getElementById("hidCPDCompaniaPar").value + "&"
			+ document.getElementById("hidCPDProducto").value + "&"
			+ document.getElementById("hidCPDTipDoc").value + "&"
			+ document.getElementById("hidCPDNroDoc").value + "&"
			+ document.getElementById("hidCPDApellido").value + "&"
			+ document.getElementById("hidCPDPolizaPar").value + "&"
			+ document.getElementById("hidCPDParamStart").value);
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onCCDLoad();
	});
}

function fCPDDetEnd() {
	fSessionValidate('fCPDDetEndExec');
}

function fCPDDetEndExec() {
	url = fGetURLPag("interface/ConEndosoDet.html?"
			+ document.getElementById("hidCPDCompaniaCod").value + "&"
			+ document.getElementById("hidCPDCompaniaDes").value + "&"
			+ document.getElementById("hidCPDPoliza").value + "&"
			+ document.getElementById("hidCPDTipoInforme").value + "&"
			+ document.getElementById("hidCPDFechaDesde").value + "&"
			+ document.getElementById("hidCPDFechaHasta").value + "&"
			+ document.getElementById("hidCPDCompaniaPar").value + "&"
			+ document.getElementById("hidCPDProducto").value + "&"
			+ document.getElementById("hidCPDTipDoc").value + "&"
			+ document.getElementById("hidCPDNroDoc").value + "&"
			+ document.getElementById("hidCPDApellido").value + "&"
			+ document.getElementById("hidCPDPolizaPar").value + "&"
			+ document.getElementById("hidCPDParamStart").value);
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onCEDLoad();
	});
}

function fCPDDetCob() {
	fSessionValidate('fCPDDetCobExec');
}

function fCPDDetCobExec() {
	url = fGetURLPag("interface/ConCobranzaDet.html?"
			+ document.getElementById("hidCPDCompaniaCod").value + "&"
			+ document.getElementById("hidCPDCompaniaDes").value + "&"
			+ document.getElementById("hidCPDPoliza").value + "&"
			+ document.getElementById("hidCPDTipoInforme").value + "&"
			+ document.getElementById("hidCPDFechaDesde").value + "&"
			+ document.getElementById("hidCPDFechaHasta").value + "&"
			+ document.getElementById("hidCPDCompaniaPar").value + "&"
			+ document.getElementById("hidCPDProducto").value + "&"
			+ document.getElementById("hidCPDTipDoc").value + "&"
			+ document.getElementById("hidCPDNroDoc").value + "&"
			+ document.getElementById("hidCPDApellido").value + "&"
			+ document.getElementById("hidCPDPolizaPar").value + "&"
			+ "apynom=" + document.getElementById("hidCPDEApyNom").value + "&"
			+ document.getElementById("hidCPDParamStart").value);
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onCCELoad();
	});
}
