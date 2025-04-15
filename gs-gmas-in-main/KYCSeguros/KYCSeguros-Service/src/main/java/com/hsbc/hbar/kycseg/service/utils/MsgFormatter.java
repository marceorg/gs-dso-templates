package com.hsbc.hbar.kycseg.service.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import com.hsbc.hbar.kycseg.model.common.Actividad;
import com.hsbc.hbar.kycseg.model.common.AuthorizedUser;
import com.hsbc.hbar.kycseg.model.common.Auxiliar;
import com.hsbc.hbar.kycseg.model.common.Caracter;
import com.hsbc.hbar.kycseg.model.common.CategoriaGS;
import com.hsbc.hbar.kycseg.model.common.CondicionIVA;
import com.hsbc.hbar.kycseg.model.common.Pais;
import com.hsbc.hbar.kycseg.model.common.Provincia;
import com.hsbc.hbar.kycseg.model.common.TipoDoc;
import com.hsbc.hbar.kycseg.model.constant.KYCSegConstants;
import com.hsbc.hbar.kycseg.model.constant.MessageConstants;
import com.hsbc.hbar.kycseg.model.kyc.Compania;
import com.hsbc.hbar.kycseg.model.kyc.EstadoKYC;
import com.hsbc.hbar.kycseg.model.kyc.KYCPendiente;
import com.hsbc.hbar.kycseg.model.kyc.KYCPersFis;
import com.hsbc.hbar.kycseg.model.kyc.KYCPersJur;
import com.hsbc.hbar.kycseg.model.kyc.KYCSetResp;
import com.hsbc.hbar.kycseg.model.kyc.OperacionInusual;
import com.hsbc.hbar.kycseg.model.kyc.Representante;
import com.hsbc.hbar.kycseg.model.kyc.TitularMedioPago;

public class MsgFormatter {
	// Get Estado de respuesta
	public static String getEstado(final String response) {
		String estado = "ER";
		if (response.length() > 20) {
			estado = response.substring(18, 20);
		}
		return estado;
	}

	// Set Header
	private static String setHeader(final String numeroMsg) {
		String header = "";
		header += numeroMsg;
		header += "0020" + "          " + "  " + "  ";
		header += "000000000" + "  " + "  " + "000000000";
		header += "  " + "000000000" + "  " + "000000000";
		return header;
	}

	// Set Field
	private static String setField(final String request, final String tipo,
			final Integer tamano) {
		return setField(request, tipo, tamano, 0);
	}

	private static String setField(final String request, final String tipo,
			final Integer tamano, final Integer decimales) {
		String field = "";
		if (tipo.equalsIgnoreCase(MessageConstants.MSG_TYPE_STRING)) {
			field = String.format("%1$-" + tamano + "s",
					UtilFormat.setCharsAIS(request));
		} else if (tipo.equalsIgnoreCase(MessageConstants.MSG_TYPE_NUMERIC)) {
			field = String.format("%0" + tamano + "d", Long.parseLong(request));
		} else if (tipo.equalsIgnoreCase(MessageConstants.MSG_TYPE_DECIMAL)) {
			field = String.format("%0" + (tamano - decimales) + "d",
					Long.parseLong(request.substring(0, request.indexOf("."))));
			field += ((request.substring(request.indexOf(".") + 1,
					request.length())) + String.format("%0" + decimales + "d",
							0)).substring(0, decimales);
		} else if (tipo.equalsIgnoreCase(MessageConstants.MSG_TYPE_DATE)) {
			field = String.format("%0" + tamano + "d", Long.parseLong(request));
		}
		return field;
	}

	// Get Field
	private static String getField(final String response, final String tipo,
			final Auxiliar inicio, final Integer tamano) {
		return getField(response, tipo, inicio, tamano, 0);
	}

	private static String getField(final String response, final String tipo,
			final Auxiliar inicio, final Integer tamano, final Integer decimales) {
		String field = "";
		if (tipo.equalsIgnoreCase(MessageConstants.MSG_TYPE_STRING)) {
			field = UtilFormat.getCharsAIS(response.substring(
					inicio.getNumber(), inicio.getNumber() + tamano).trim());
		} else if (tipo.equalsIgnoreCase(MessageConstants.MSG_TYPE_NUMERIC)) {
			field = response.substring(inicio.getNumber(), inicio.getNumber()
					+ tamano);
		} else if (tipo.equalsIgnoreCase(MessageConstants.MSG_TYPE_DECIMAL)) {
			field = response.substring(inicio.getNumber(), inicio.getNumber()
					+ tamano);
			field = field.substring(0, field.length() - decimales)
					+ "."
					+ field.substring(field.length() - decimales,
							field.length());
		} else if (tipo.equalsIgnoreCase(MessageConstants.MSG_TYPE_DATE)) {
			field = response.substring(inicio.getNumber(), inicio.getNumber()
					+ tamano);
		}
		inicio.setNumber(inicio.getNumber() + tamano);
		return field;
	}

	// Get Paises (Request)
	public static String reqMFGetPaisList() {
		String reqMF = "";
		reqMF += setHeader(MessageConstants.MSG_PAIS_MessageID);
		return reqMF;
	}

	// Get Paises (Response)
	public static List<Pais> resMFGetPaisList(final String response) {
		List<Pais> paisList = null;

		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_PAIS_INI);
		Integer cantPais = Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_PAIS_cantPais));
		paisList = new ArrayList<Pais>();
		for (int i = 0; i < cantPais; i++) {
			Pais pais = new Pais();
			pais.setId(Integer.parseInt(getField(response,
					MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
					MessageConstants.MSG_RES_PAIS_paisCod)));
			pais.setName(getField(response, MessageConstants.MSG_TYPE_STRING,
					auxPosicion, MessageConstants.MSG_RES_PAIS_paisNom));
			paisList.add(pais);
		}

		return paisList;
	}

	// Get Actividades (Request)
	public static String reqMFGetActividadList(final String filtroAct) {
		String reqMF = "";
		reqMF += setHeader(MessageConstants.MSG_ACTIV_MessageID);
		reqMF += setField(filtroAct, MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_ACTIV_actividadNom);
		reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_ACTIV_actividadCod);
		reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_ACTIV_actividadOtr);
		return reqMF;
	}

	// Get Actividades (Response)
	public static List<Actividad> resMFGetActividadList(final String response) {
		List<Actividad> actividadList = null;

		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_ACTIV_INI);
		Integer cantAct = Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_ACTIV_cantAct));
		actividadList = new ArrayList<Actividad>();
		for (int i = 0; i < cantAct; i++) {
			Actividad actividad = new Actividad();
			actividad.setId(Integer.parseInt(getField(response,
					MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
					MessageConstants.MSG_RES_ACTIV_actividadCod)));
			actividad.setName(getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_ACTIV_actividadNom));
			actividadList.add(actividad);
		}

		return actividadList;
	}

	// Get KYC Categorias GS (Request)
	public static String reqMFGetCategoriaGSList(final Integer categoriaAIS) {
		String reqMF = "";
		reqMF += setHeader(MessageConstants.MSG_CATEGGS_MessageID);
		reqMF += setField(categoriaAIS.toString(),
				MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_CATEGGS_categCliAIS);
		return reqMF;
	}

	// Get KYC Categorias GS (Response)
	public static List<CategoriaGS> resMFGetCategoriaList(final String response) {
		List<CategoriaGS> categoriaList = null;

		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_CATEGGS_INI);
		Integer cantCtg = Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_ACTIV_cantAct));
		categoriaList = new ArrayList<CategoriaGS>();
		for (int i = 0; i < cantCtg; i++) {
			CategoriaGS categoria = new CategoriaGS();
			categoria.setId(getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_REQ_CATEGGS_categCliGS));
			categoria.setName(getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_REQ_CATEGGS_descCategCliGS));
			categoriaList.add(categoria);
		}

		return categoriaList;
	}

	// Get KYC Personas Fisicas (Request)
	public static String reqMFGetKYCPersFis(final Integer nroLlamada,
			final Long numeroCUIL, final String apellido, final String nombre) {
		String reqMF = "";
		reqMF += setHeader(MessageConstants.MSG_KYCG_MessageID);
		reqMF += setField(numeroCUIL.toString(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCG_numeroCUIL);
		reqMF += setField(apellido, MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCG_apellido);
		reqMF += setField(nombre, MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCG_nombre);
		reqMF += setField(nroLlamada.toString(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCG_nroLlamada);
		return reqMF;
	}

	// Get KYC Personas Fisicas (Response)
	public static KYCPersFis resMFGetKYCPersFis(final String response,
			final Long numeroCUIL) {
		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_KYCG_INI);
		// Persona Fisica
		KYCPersFis kycPersFis = new KYCPersFis();
		// Datos en AIS
		kycPersFis.setPrimaAnualenAIS(Double.parseDouble(getField(response,
				MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
				MessageConstants.MSG_RES_KYCG_primaAnualenAIS,
				MessageConstants.MSG_RES_KYCG_primaAnualenAIS_DEC)));
		kycPersFis
		.setEsSCCenAIS(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_esSCCenAIS)
				.equalsIgnoreCase("S") ? true : false);
		kycPersFis
		.setEsPEPenAIS(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_esPEPenAIS)
				.equalsIgnoreCase("S") ? true : false);
		kycPersFis.setPerfilObligenAIS(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_perfilObligenAIS)
				.equalsIgnoreCase("S") ? true : false);
		// Tipo Operacion y estado
		String tipoOperacion = getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_tipoOperacion);
		Integer vigenciaDesde = Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_vigenciaDesde));
		Integer vigenciaHasta = Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_vigenciaHasta));
		String estadoKYCCod = getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_estadoCod);
		String estadoKYCDes = getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_estadoDes);
		// Si no es persona fisica
		String tipoPersona = getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_tipoPersona);
		if (tipoPersona.equalsIgnoreCase("J")) {
			// Devuelvo estado P (Error en tipo de persona)
			KYCPersFis kycPersFisAux = new KYCPersFis();
			EstadoKYC estadoKYC = new EstadoKYC();
			estadoKYC.setCodigo("P");
			kycPersFisAux.setEstadoKYC(estadoKYC);
			return kycPersFisAux;
		}
		// Datos de la persona
		TipoDoc tipoDoc = new TipoDoc();
		tipoDoc.setId(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_tipoDoc)));
		tipoDoc.setName(getField(response, MessageConstants.MSG_TYPE_STRING,
				auxPosicion, MessageConstants.MSG_RES_KYCG_tipoDocDes));
		kycPersFis.setTipoDoc(tipoDoc);
		String numeroDoc = getField(response, MessageConstants.MSG_TYPE_STRING,
				auxPosicion, MessageConstants.MSG_RES_KYCG_numeroDoc);
		if (numeroDoc.equalsIgnoreCase("")) {
			kycPersFis.setNumeroDoc(Long.parseLong("0"));
		} else {
			kycPersFis.setNumeroDoc(Long.parseLong(numeroDoc));
		}
		kycPersFis.setNumeroCUIL(numeroCUIL);
		kycPersFis.setApellido(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_apellido));
		kycPersFis.setNombre(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_nombre));
		// Determino el estado
		if (tipoOperacion.equalsIgnoreCase("A")
				&& !kycPersFis.getApellido().equalsIgnoreCase("")) {
			// Es un alta (trae datos precargados)
			estadoKYCCod = "N";
			estadoKYCDes = "NUEVO";
		} else if (tipoOperacion.equalsIgnoreCase("A")
				&& kycPersFis.getApellido().equalsIgnoreCase("")) {
			// Es un alta (no trae datos precargados)
			estadoKYCCod = "X";
			estadoKYCDes = "INEXISTENTE";
		} else if (tipoOperacion.equalsIgnoreCase("M")
				&& estadoKYCCod.equalsIgnoreCase("")) {
			// No es un alta (no tiene kyc aprobados)
			estadoKYCCod = "";
			estadoKYCDes = "INEXISTENTE";
		} else {
			// No es un alta (tiene kyc aprobados)
		}
		// Generales
		EstadoKYC estadoKYC = new EstadoKYC();
		estadoKYC.setCodigo(estadoKYCCod);
		estadoKYC.setDescripcion(estadoKYCDes);
		kycPersFis.setEstadoKYC(estadoKYC);
		kycPersFis.setTipoOperacion(tipoOperacion);
		kycPersFis.setVigenciaDesde(vigenciaDesde);
		kycPersFis.setVigenciaHasta(vigenciaHasta);
		// Datos
		Pais nacionalidad = new Pais();
		String nacionalidadId = getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_nacionalidad);
		if (nacionalidadId.equalsIgnoreCase("")) {
			nacionalidad.setId(0);
		} else {
			nacionalidad.setId(Integer.parseInt(nacionalidadId));
		}
		kycPersFis.setNacionalidad(nacionalidad);
		/*
		 * Integer fechaConstitucion = Integer.parseInt(getField(response,
		 * MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
		 * MessageConstants.MSG_RES_KYCG_fechaConstitucion));
		 */
		kycPersFis.setFechaNacimiento(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_fechaConstitucion))); // PPCR_2015-00142_(ENS)
		kycPersFis.setDirCalle(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_dirCalle));
		kycPersFis.setDirNumero(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_dirNumero));
		kycPersFis.setDirPiso(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_dirPiso));
		kycPersFis.setDirDepto(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_dirDepto));
		kycPersFis.setDirLocalidad(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_dirLocalidad));
		Provincia provincia = new Provincia();
		provincia.setId(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_dirProvincia)));
		kycPersFis.setDirProvincia(provincia);
		Integer codigoPostal = Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_dirCodigoPostal));
		kycPersFis.setDirCodigoPostal(codigoPostal.toString());
		kycPersFis.setTelefono(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_telefono));
		kycPersFis.setEmail(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_email));
		// Titular de Medio de Pago
		Integer titMpgTipoDoc = Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_titMpgTipoDoc));
		kycPersFis.setEsTitMPago(titMpgTipoDoc == 0 ? true : false);
		List<TitularMedioPago> titMPagoList = new ArrayList<TitularMedioPago>();
		if (!kycPersFis.getEsTitMPago()) {
			TitularMedioPago titularMedioPago = new TitularMedioPago();
			TipoDoc tipoDocTitMPg = new TipoDoc();
			tipoDocTitMPg.setId(titMpgTipoDoc);
			titularMedioPago.setTipoDoc(tipoDocTitMPg);
			titularMedioPago.setNumeroDoc(Long.parseLong(getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_KYCG_titMpgNumeroDoc)));
			titularMedioPago.setApellido(getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_KYCG_titMpgApellido));
			titularMedioPago.setNombre(getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_KYCG_titMpgNombre));
			titularMedioPago.setMedioPago(getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_KYCG_titMpgMedioPago));
			titMPagoList.add(titularMedioPago);
		} else {
			String titMPgVoid = getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_KYCG_titMpgNumeroDoc
					+ MessageConstants.MSG_RES_KYCG_titMpgApellido
					+ MessageConstants.MSG_RES_KYCG_titMpgNombre
					+ MessageConstants.MSG_RES_KYCG_titMpgMedioPago);
		}
		kycPersFis.setTitMPagoList(titMPagoList);
		Actividad actividad = new Actividad();
		actividad.setId(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_actividadCod)));
		actividad.setName(getField(response, MessageConstants.MSG_TYPE_STRING,
				auxPosicion, MessageConstants.MSG_RES_KYCG_actividadNom));
		kycPersFis.setActividad(actividad);
		Integer caracterCod = Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_caracterCod));
		String cliRegOrganismo = getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_cliRegOrganismo);
		kycPersFis
		.setEsSCC(getField(response, MessageConstants.MSG_TYPE_STRING,
				auxPosicion, MessageConstants.MSG_RES_KYCG_esSCC)
				.equalsIgnoreCase("S") ? true : false);
		kycPersFis
		.setEsPEP(getField(response, MessageConstants.MSG_TYPE_STRING,
				auxPosicion, MessageConstants.MSG_RES_KYCG_esPEP)
				.equalsIgnoreCase("S") ? true : false);
		kycPersFis.setEsClienteBco(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_esClienteBco).equalsIgnoreCase(
						"S") ? true : false);
		String cotizaBolsa = getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_cotizaBolsa);
		String subsCiaCotizaBolsa = getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_subsCiaCotizaBolsa);

		CondicionIVA condicionIVA = new CondicionIVA();
		String condicionIVAId = getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_condicionIVA);
		if (condicionIVAId.equalsIgnoreCase("")) {
			condicionIVA.setId(0);
		} else {
			condicionIVA.setId(Integer.parseInt(condicionIVAId));
		}
		kycPersFis.setCondicionIVA(condicionIVA);
		kycPersFis.setCategoriaMono(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_categoriaMono));
		// Ingresos
		kycPersFis.setIngFecha(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_ingFecha)));
		kycPersFis.setCondicionLab(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_condicionLab));
		Double ingSalario = Double.parseDouble(getField(response,
				MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
				MessageConstants.MSG_RES_KYCG_ingImporte1,
				MessageConstants.MSG_RES_KYCG_ingImporte1_DEC));
		Double ingGanancia = Double.parseDouble(getField(response,
				MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
				MessageConstants.MSG_RES_KYCG_ingImporte2,
				MessageConstants.MSG_RES_KYCG_ingImporte2_DEC));
		Double ingOtros = Double.parseDouble(getField(response,
				MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
				MessageConstants.MSG_RES_KYCG_ingImporte3,
				MessageConstants.MSG_RES_KYCG_ingImporte3_DEC));
		Double ingImporte4 = Double.parseDouble(getField(response,
				MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
				MessageConstants.MSG_RES_KYCG_ingImporte4,
				MessageConstants.MSG_RES_KYCG_ingImporte4_DEC));
		Double valorOperar = Double.parseDouble(getField(response,
				MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
				MessageConstants.MSG_RES_KYCG_ingImporte5,
				MessageConstants.MSG_RES_KYCG_ingImporte5_DEC));
		Double ingSalMen = Double.parseDouble(getField(response,
				MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
				MessageConstants.MSG_RES_KYCG_ingImporte6,
				MessageConstants.MSG_RES_KYCG_ingImporte6_DEC));
		kycPersFis.setIngSalMen(ingSalMen);
		kycPersFis.setIngSalario(ingSalario);
		kycPersFis.setIngGanancia(ingGanancia);
		kycPersFis.setIngOtros(ingOtros);
		Double ingTotal = ingSalario * 100;
		ingTotal += ingGanancia * 100;
		ingTotal += ingOtros * 100;
		ingTotal = ingTotal / 100;
		kycPersFis.setIngTotal(ingTotal);
		Integer fechaEstContables = Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_fechaEstContables));
		// Fin ingresos
		String auditor = getField(response, MessageConstants.MSG_TYPE_STRING,
				auxPosicion, MessageConstants.MSG_RES_KYCG_auditor);
		kycPersFis.setTieneRelHSBC(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_tieneRelHSBC).equalsIgnoreCase(
						"S") ? true : false);
		kycPersFis.setInicioAnn(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_inicioAnn)));
		kycPersFis.setValorOperar(valorOperar);
		kycPersFis.setPrimaAnual(Double.parseDouble(getField(response,
				MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
				MessageConstants.MSG_RES_KYCG_primaAnual,
				MessageConstants.MSG_RES_KYCG_primaAnual_DEC)));
		kycPersFis.setUltFecha(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_ultFecha)));
		// Textos
		kycPersFis.setActividadDes(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_actividadDes));
		kycPersFis.setPropositoDes(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_propositoDes));
		kycPersFis.setMotivoSCC(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_motivoSCC));
		kycPersFis.setDocResDetalle(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_docResDetalle));
		kycPersFis.setRelDetalle(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_relDetalle));
		kycPersFis.setValorOperarMot(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_valorOperarMot));
		kycPersFis.setPerfilComentarios(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_perfilComentarios));
		String observaciones = getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_observaciones);
		String accionistas = getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_accionistas);
		String caracterDes = getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_caracterDes);
		kycPersFis.setSupComentario(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_supComentario));
		kycPersFis.setComComentario(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_comComentario));
		// Representantes
		kycPersFis.setTieneRepSCC(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_tieneRepSCC)
				.equalsIgnoreCase("S") ? true : false);
		Integer cantRep = Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_cantRep));
		kycPersFis.setTieneRep(cantRep == 0 ? false : true);
		List<Representante> representanteList = new ArrayList<Representante>();
		for (int j = 0; j < MessageConstants.MSG_RES_KYCG_representanteList; j++) {
			if (j < cantRep) {
				Representante representante = new Representante();
				TipoDoc tipoDocRep = new TipoDoc();
				tipoDocRep.setId(Integer.parseInt(getField(response,
						MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
						MessageConstants.MSG_RES_KYCG_RepTipoDoc)));
				representante.setTipoDoc(tipoDocRep);
				representante.setNumeroDoc(Integer.parseInt(getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_RepNumeroDoc)));
				representante.setApellido(getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_RepApellido));
				representante.setNombre(getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_RepNombre));
				representante.setCargo(getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_RepCargo));
				representante.setEsSCC(getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_RepEsSCC)
						.equalsIgnoreCase("S") ? true : false);
				representante.setEsPEP(getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_RepEsPEP)
						.equalsIgnoreCase("S") ? true : false);
				representante.setFechaConstitNacim(Integer
						.parseInt(getField(response,
								MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
								MessageConstants.MSG_REQ_KYCS_RepFechaNac)));
				representanteList.add(representante);
			} else {
				String repVoid = getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_RepTipoDoc
						+ MessageConstants.MSG_RES_KYCG_RepNumeroDoc
						+ MessageConstants.MSG_RES_KYCG_RepApellido
						+ MessageConstants.MSG_RES_KYCG_RepNombre
						+ MessageConstants.MSG_RES_KYCG_RepCargo
						+ MessageConstants.MSG_RES_KYCG_RepEsSCC
						+ MessageConstants.MSG_RES_KYCG_RepEsPEP
						+ MessageConstants.MSG_REQ_KYCS_RepFechaNac);
			}
		}
		kycPersFis.setRepresentanteList(representanteList);
		// Operaciones Inusuales
		Integer cantOIn = Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_cantOIn));
		List<OperacionInusual> opeInusualList = new ArrayList<OperacionInusual>();
		for (int j = 0; j < MessageConstants.MSG_RES_KYCG_opeInusualList; j++) {
			if (j < cantOIn) {
				OperacionInusual operacionInusual = new OperacionInusual();
				operacionInusual.setSecuencia(Integer
						.parseInt(getField(response,
								MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
								MessageConstants.MSG_RES_KYCG_OInSecuencia)));
				operacionInusual.setFecha(Integer.parseInt(getField(response,
						MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
						MessageConstants.MSG_RES_KYCG_OInFecha)));
				operacionInusual.setTipoOperacion(getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_OInTipoOperacion));
				operacionInusual.setOrigenFondos(getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_OInOrigenFondos));
				operacionInusual.setMonto(Double.parseDouble(getField(response,
						MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
						MessageConstants.MSG_RES_KYCG_OInMonto,
						MessageConstants.MSG_RES_KYCG_OInMonto_DEC)));
				operacionInusual.setObservacion(getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_OInObservacion));
				opeInusualList.add(operacionInusual);
			} else {
				String oinVoid = getField(
						response,
						MessageConstants.MSG_TYPE_STRING,
						auxPosicion,
						MessageConstants.MSG_RES_KYCG_OInSecuencia
						+ MessageConstants.MSG_RES_KYCG_OInFecha
						+ MessageConstants.MSG_RES_KYCG_OInTipoOperacion
						+ MessageConstants.MSG_RES_KYCG_OInOrigenFondos
						+ MessageConstants.MSG_RES_KYCG_OInMonto
						+ MessageConstants.MSG_RES_KYCG_OInObservacion);
			}
		}
		kycPersFis.setOpeInusualList(opeInusualList);
		// Companias
		String ciaVoid = getField(
				response,
				MessageConstants.MSG_TYPE_STRING,
				auxPosicion,
				MessageConstants.MSG_RES_KYCG_cantCia
				+ ((MessageConstants.MSG_RES_KYCG_CiaCompania
						+ MessageConstants.MSG_RES_KYCG_CiaEsSCC + MessageConstants.MSG_RES_KYCG_CiaFechaCons) * MessageConstants.MSG_RES_KYCG_companiaList));
		// Otros Datos
		AuthorizedUser operador = new AuthorizedUser();
		operador.setPeopleSoft(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_opePeopleSoft));
		operador.setlName(getField(response, MessageConstants.MSG_TYPE_STRING,
				auxPosicion, MessageConstants.MSG_RES_KYCG_opeLName));
		operador.setfName(getField(response, MessageConstants.MSG_TYPE_STRING,
				auxPosicion, MessageConstants.MSG_RES_KYCG_opeFName));
		operador.setProfileKey(KYCSegConstants.KYCS_USRPROF_OPE);
		kycPersFis.setOperador(operador);
		kycPersFis.setOpeFechaUpd(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_opeFechaUpd)));
		AuthorizedUser supervisor = new AuthorizedUser();
		supervisor.setPeopleSoft(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_supPeopleSoft));
		supervisor.setlName(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_supLName));
		supervisor.setfName(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_supFName));
		supervisor.setProfileKey(KYCSegConstants.KYCS_USRPROF_SUP);
		kycPersFis.setSupervisor(supervisor);
		kycPersFis.setSupFechaUpd(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_supFechaUpd)));
		AuthorizedUser compliance = new AuthorizedUser();
		compliance.setPeopleSoft(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_comPeopleSoft));
		compliance.setlName(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_comLName));
		compliance.setfName(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_comFName));
		compliance.setProfileKey(KYCSegConstants.KYCS_USRPROF_COM);
		kycPersFis.setCompliance(compliance);
		kycPersFis.setComFechaUpd(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_comFechaUpd)));

		return kycPersFis;
	}

	// Set KYC Personas Fisicas (Request)
	public static String reqMFSetKYCPersFis(final KYCPersFis kycPersFis,
			final String tipoOperacion, final Boolean actPerfilTrans,
			final Boolean esKYCNuevo, final Integer vigenciaDesde,
			final Integer vigenciaHasta, final Boolean perfilObligenAIS,
			final AuthorizedUser operador, final AuthorizedUser supervisor) {
		String reqMF = "";
		reqMF += setHeader(MessageConstants.MSG_KYCS_MessageID);
		reqMF += setField(kycPersFis.getNumeroCUIL().toString(),
				MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_numeroCUIL);
		reqMF += setField(tipoOperacion, MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_tipoOperacion);
		if (actPerfilTrans
				|| (!perfilObligenAIS && kycPersFis.getEsSCC() && vigenciaDesde == 0)) {
			reqMF += setField("99999999", MessageConstants.MSG_TYPE_NUMERIC,
					MessageConstants.MSG_REQ_KYCS_vigenciaDesde);
			reqMF += setField("99999999", MessageConstants.MSG_TYPE_NUMERIC,
					MessageConstants.MSG_REQ_KYCS_vigenciaHasta);
		} else {
			reqMF += setField(vigenciaDesde.toString(),
					MessageConstants.MSG_TYPE_NUMERIC,
					MessageConstants.MSG_REQ_KYCS_vigenciaDesde);
			reqMF += setField(vigenciaHasta.toString(),
					MessageConstants.MSG_TYPE_NUMERIC,
					MessageConstants.MSG_REQ_KYCS_vigenciaHasta);
		}
		if (actPerfilTrans || esKYCNuevo) {
			reqMF += setField("A", MessageConstants.MSG_TYPE_STRING,
					MessageConstants.MSG_REQ_KYCS_estadoCod);
		} else {
			reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
					MessageConstants.MSG_REQ_KYCS_estadoCod);
		}
		reqMF += setField(perfilObligenAIS ? "S" : "N",
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_perfilObligenAIS);
		reqMF += setField(operador.getPeopleSoft(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_opePeopleSoft);
		reqMF += setField(operador.getlName(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_opeLName);
		reqMF += setField(operador.getfName(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_opeFName);
		reqMF += setField(supervisor.getPeopleSoft(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_supPeopleSoft);
		reqMF += setField(supervisor.getlName(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_supLName);
		reqMF += setField(supervisor.getfName(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_supFName);
		reqMF += setField("F", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_tipoPersona);
		reqMF += setField(kycPersFis.getTipoDoc().getId().toString(),
				MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_tipoDoc);
		reqMF += setField(kycPersFis.getNumeroDoc().toString(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_numeroDoc);
		reqMF += setField(kycPersFis.getApellido(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_apellido);
		reqMF += setField(kycPersFis.getNombre(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_nombre);
		reqMF += setField(kycPersFis.getNacionalidad().getId().toString(),
				MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_nacionalidad);
		reqMF += setField(kycPersFis.getFechaNacimiento().toString(),
				MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_fechaConstitucion); // PPCR_2015-00142_(ENS)
		reqMF += setField(kycPersFis.getDirCalle(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_dirCalle);
		reqMF += setField(kycPersFis.getDirNumero(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_dirNumero);
		reqMF += setField(kycPersFis.getDirPiso(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_dirPiso);
		reqMF += setField(kycPersFis.getDirDepto(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_dirDepto);
		reqMF += setField(kycPersFis.getDirLocalidad(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_dirLocalidad);
		reqMF += setField(kycPersFis.getDirProvincia().getId().toString(),
				MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_dirProvincia);
		reqMF += setField(kycPersFis.getDirCodigoPostal(),
				MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_dirCodigoPostal);
		reqMF += setField(kycPersFis.getTelefono(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_telefono);
		reqMF += setField(kycPersFis.getEmail(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_email);
		if (!kycPersFis.getEsTitMPago()) {
			TitularMedioPago titularMedioPago = kycPersFis.getTitMPagoList()
					.get(0);
			reqMF += setField(titularMedioPago.getTipoDoc().getId().toString(),
					MessageConstants.MSG_TYPE_NUMERIC,
					MessageConstants.MSG_REQ_KYCS_titMpgTipoDoc);
			reqMF += setField(titularMedioPago.getNumeroDoc().toString(),
					MessageConstants.MSG_TYPE_STRING,
					MessageConstants.MSG_REQ_KYCS_titMpgNumeroDoc);
			reqMF += setField(titularMedioPago.getApellido(),
					MessageConstants.MSG_TYPE_STRING,
					MessageConstants.MSG_REQ_KYCS_titMpgApellido);
			reqMF += setField(titularMedioPago.getNombre(),
					MessageConstants.MSG_TYPE_STRING,
					MessageConstants.MSG_REQ_KYCS_titMpgNombre);
			reqMF += setField(titularMedioPago.getMedioPago(),
					MessageConstants.MSG_TYPE_STRING,
					MessageConstants.MSG_REQ_KYCS_titMpgMedioPago);
		} else {
			reqMF += setField("0", MessageConstants.MSG_TYPE_NUMERIC,
					MessageConstants.MSG_REQ_KYCS_titMpgTipoDoc);
			reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
					MessageConstants.MSG_REQ_KYCS_titMpgNumeroDoc);
			reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
					MessageConstants.MSG_REQ_KYCS_titMpgApellido);
			reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
					MessageConstants.MSG_REQ_KYCS_titMpgNombre);
			reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
					MessageConstants.MSG_REQ_KYCS_titMpgMedioPago);
		}
		reqMF += setField(kycPersFis.getActividad().getId().toString(),
				MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_actividadCod);
		reqMF += setField("0", MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_caracterCod);
		reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_cliRegOrganismo);
		reqMF += setField(kycPersFis.getEsSCC() ? "S" : "N",
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_esSCC);
		reqMF += setField(kycPersFis.getEsPEP() ? "S" : "N",
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_esPEP);
		reqMF += setField(kycPersFis.getEsClienteBco() ? "S" : "N",
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_esClienteBco);
		reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_cotizaBolsa);
		reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_subsCiaCotizaBolsa);
		reqMF += setField(kycPersFis.getCondicionIVA().getId().toString(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_condicionIVA);
		reqMF += setField(kycPersFis.getCategoriaMono(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_categoriaMono);
		// Ingresos
		reqMF += setField(kycPersFis.getIngFecha().toString(),
				MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_ingFecha);
		reqMF += setField(kycPersFis.getCondicionLab(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_condicionLab);
		reqMF += setField(
				String.format(Locale.US, "%f", kycPersFis.getIngSalario()),
				MessageConstants.MSG_TYPE_DECIMAL,
				MessageConstants.MSG_REQ_KYCS_ingImporte1,
				MessageConstants.MSG_REQ_KYCS_ingImporte1_DEC);
		reqMF += setField(
				String.format(Locale.US, "%f", kycPersFis.getIngGanancia()),
				MessageConstants.MSG_TYPE_DECIMAL,
				MessageConstants.MSG_REQ_KYCS_ingImporte2,
				MessageConstants.MSG_REQ_KYCS_ingImporte2_DEC);
		reqMF += setField(
				String.format(Locale.US, "%f", kycPersFis.getIngOtros()),
				MessageConstants.MSG_TYPE_DECIMAL,
				MessageConstants.MSG_REQ_KYCS_ingImporte3,
				MessageConstants.MSG_REQ_KYCS_ingImporte3_DEC);
		reqMF += setField(String.format(Locale.US, "%f", new Double(0)),
				MessageConstants.MSG_TYPE_DECIMAL,
				MessageConstants.MSG_REQ_KYCS_ingImporte4,
				MessageConstants.MSG_REQ_KYCS_ingImporte4_DEC);
		reqMF += setField(
				String.format(Locale.US, "%f", kycPersFis.getValorOperar()),
				MessageConstants.MSG_TYPE_DECIMAL,
				MessageConstants.MSG_REQ_KYCS_ingImporte5,
				MessageConstants.MSG_REQ_KYCS_ingImporte5_DEC);
		reqMF += setField(
				String.format(Locale.US, "%f", kycPersFis.getIngSalMen()),
				MessageConstants.MSG_TYPE_DECIMAL,
				MessageConstants.MSG_REQ_KYCS_ingImporte6,
				MessageConstants.MSG_REQ_KYCS_ingImporte6_DEC);
		reqMF += setField("0", MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_fechaEstContables);
		reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_auditor);
		reqMF += setField(kycPersFis.getInicioAnn().toString(),
				MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_inicioAnn);
		reqMF += setField(
				String.format(Locale.US, "%f", kycPersFis.getPrimaAnual()),
				MessageConstants.MSG_TYPE_DECIMAL,
				MessageConstants.MSG_REQ_KYCS_primaAnual,
				MessageConstants.MSG_REQ_KYCS_primaAnual_DEC);
		reqMF += setField(kycPersFis.getUltFecha().toString(),
				MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_ultFecha);
		// Textos
		reqMF += setField(kycPersFis.getActividadDes(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_actividadDes);
		reqMF += setField(kycPersFis.getPropositoDes(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_propositoDes);
		reqMF += setField(kycPersFis.getMotivoSCC(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_motivoSCC);
		reqMF += setField(kycPersFis.getDocResDetalle(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_docResDetalle);
		reqMF += setField(kycPersFis.getRelDetalle(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_relDetalle);
		reqMF += setField(kycPersFis.getValorOperarMot(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_valorOperarMot);
		reqMF += setField(kycPersFis.getPerfilComentarios(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_perfilComentarios);
		reqMF += setField(".", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_perfilComentarios_Filler);
		reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_observaciones);
		reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_accionistas);
		reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_caracterDes);
		// Representantes
		List<Representante> representanteList = kycPersFis
				.getRepresentanteList();
		for (int j = 0; j < MessageConstants.MSG_REQ_KYCS_representanteList; j++) {
			if (j < representanteList.size()) {
				reqMF += setField(representanteList.get(j).getTipoDoc().getId()
						.toString(), MessageConstants.MSG_TYPE_NUMERIC,
						MessageConstants.MSG_REQ_KYCS_RepTipoDoc);
				reqMF += setField(representanteList.get(j).getNumeroDoc()
						.toString(), MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepNumeroDoc);
				reqMF += setField(representanteList.get(j).getApellido(),
						MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepApellido);
				reqMF += setField(representanteList.get(j).getNombre(),
						MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepNombre);
				reqMF += setField(representanteList.get(j).getCargo(),
						MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepCargo);
				reqMF += setField(representanteList.get(j).getEsSCC() ? "S"
						: "N", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepEsSCC);
				reqMF += setField(representanteList.get(j).getEsPEP() ? "S"
						: "N", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepEsPEP);
				reqMF += setField(representanteList.get(j)
						.getFechaConstitNacim().toString(),
						MessageConstants.MSG_TYPE_NUMERIC,
						MessageConstants.MSG_REQ_KYCS_RepFechaNac);
			} else {
				reqMF += setField("0", MessageConstants.MSG_TYPE_NUMERIC,
						MessageConstants.MSG_REQ_KYCS_RepTipoDoc);
				reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepNumeroDoc);
				reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepApellido);
				reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepNombre);
				reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepCargo);
				reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepEsSCC);
				reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepEsPEP);
				reqMF += setField("0", MessageConstants.MSG_TYPE_NUMERIC,
						MessageConstants.MSG_REQ_KYCS_RepFechaNac);
			}
		}
		// Operaciones Inusuales
		List<OperacionInusual> opeInusualList = kycPersFis.getOpeInusualList();
		for (int j = 0; j < MessageConstants.MSG_REQ_KYCS_opeInusualList; j++) {
			if (j < opeInusualList.size()) {
				reqMF += setField(opeInusualList.get(j).getFecha().toString(),
						MessageConstants.MSG_TYPE_NUMERIC,
						MessageConstants.MSG_REQ_KYCS_OInFecha);
				reqMF += setField(opeInusualList.get(j).getTipoOperacion(),
						MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_OInTipoOperacion);
				reqMF += setField(opeInusualList.get(j).getOrigenFondos(),
						MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_OInOrigenFondos);
				reqMF += setField(String.format(Locale.US, "%f", opeInusualList
						.get(j).getMonto()), MessageConstants.MSG_TYPE_DECIMAL,
						MessageConstants.MSG_REQ_KYCS_OInMonto,
						MessageConstants.MSG_REQ_KYCS_OInMonto_DEC);
				reqMF += setField(opeInusualList.get(j).getObservacion(),
						MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_OInObservacion);
			} else {
				reqMF += setField("0", MessageConstants.MSG_TYPE_NUMERIC,
						MessageConstants.MSG_REQ_KYCS_OInFecha);
				reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_OInTipoOperacion);
				reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_OInOrigenFondos);
				reqMF += setField("0.00", MessageConstants.MSG_TYPE_DECIMAL,
						MessageConstants.MSG_REQ_KYCS_OInMonto,
						MessageConstants.MSG_REQ_KYCS_OInMonto_DEC);
				reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_OInObservacion);
			}
		}
		// Companias
		for (int j = 0; j < MessageConstants.MSG_REQ_KYCS_companiaList; j++) {
			reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
					MessageConstants.MSG_REQ_KYCS_CiaCompania);
			reqMF += setField(".", MessageConstants.MSG_TYPE_STRING,
					MessageConstants.MSG_REQ_KYCS_CiaEsSCC);
			reqMF += setField("0", MessageConstants.MSG_TYPE_NUMERIC,
					MessageConstants.MSG_REQ_KYCS_CiaFechaCons);
		}
		// Fin
		reqMF += setField(".", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_Fin);

		return reqMF;
	}

	// Set KYC Personas Fisicas (Response)
	public static KYCSetResp resMFSetKYCPersFis(final String response) {
		KYCSetResp kycSetResp = new KYCSetResp();
		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_KYCS_INI);
		kycSetResp.setEstadoGra(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCS_estadoGra)));
		kycSetResp.setEstadoAsi(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCS_estadoAsi)));
		EstadoKYC estadoKYC = new EstadoKYC();
		estadoKYC.setCodigo(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCS_estadoCod));
		estadoKYC.setDescripcion(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCS_estadoDes));
		kycSetResp.setEstadoKYC(estadoKYC);
		return kycSetResp;
	}

	// Get KYC Personas Juridicas (Request)
	public static String reqMFGetKYCPersJur(final Integer nroLlamada,
			final Long numeroCUIT, final String razonSocial) {
		String reqMF = "";
		reqMF += setHeader(MessageConstants.MSG_KYCG_MessageID);
		reqMF += setField(numeroCUIT.toString(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCG_numeroCUIL);
		reqMF += setField(razonSocial, MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCG_apellido
				+ MessageConstants.MSG_REQ_KYCG_nombre);
		reqMF += setField(nroLlamada.toString(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCG_nroLlamada);
		return reqMF;
	}

	// Get KYC Personas Juridicas (Response)
	public static KYCPersJur resMFGetKYCPersJur(final String response,
			final Long numeroCUIT) {
		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_KYCG_INI);
		// Persona Juridica
		KYCPersJur kycPersJur = new KYCPersJur();
		// Datos en AIS
		kycPersJur.setPrimaAnualenAIS(Double.parseDouble(getField(response,
				MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
				MessageConstants.MSG_RES_KYCG_primaAnualenAIS,
				MessageConstants.MSG_RES_KYCG_primaAnualenAIS_DEC)));
		kycPersJur
		.setEsSCCenAIS(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_esSCCenAIS)
				.equalsIgnoreCase("S") ? true : false);
		String esPEPenAIS = getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_esPEPenAIS);
		kycPersJur.setPerfilObligenAIS(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_perfilObligenAIS)
				.equalsIgnoreCase("S") ? true : false);
		// Tipo Operacion y estado
		String tipoOperacion = getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_tipoOperacion);
		Integer vigenciaDesde = Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_vigenciaDesde));
		Integer vigenciaHasta = Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_vigenciaHasta));
		String estadoKYCCod = getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_estadoCod);
		String estadoKYCDes = getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_estadoDes);
		// Si no es persona fisica
		String tipoPersona = getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_tipoPersona);
		if (tipoPersona.equalsIgnoreCase("F")) {
			// Devuelvo estado P (Error en tipo de persona)
			KYCPersJur kycPersJurAux = new KYCPersJur();
			EstadoKYC estadoKYC = new EstadoKYC();
			estadoKYC.setCodigo("P");
			kycPersJurAux.setEstadoKYC(estadoKYC);
			return kycPersJurAux;
		}
		// Datos de la persona
		TipoDoc tipoDoc = new TipoDoc();
		tipoDoc.setId(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_tipoDoc)));
		tipoDoc.setName(getField(response, MessageConstants.MSG_TYPE_STRING,
				auxPosicion, MessageConstants.MSG_RES_KYCG_tipoDocDes));
		String numeroDoc = getField(response, MessageConstants.MSG_TYPE_STRING,
				auxPosicion, MessageConstants.MSG_RES_KYCG_numeroDoc);
		kycPersJur.setNumeroCUIT(numeroCUIT);
		kycPersJur.setRazonSocial(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_apellido
				+ MessageConstants.MSG_RES_KYCG_nombre));
		// Determino el estado
		if (tipoOperacion.equalsIgnoreCase("A")
				&& !kycPersJur.getRazonSocial().equalsIgnoreCase("")) {
			// Es un alta (trae datos precargados)
			estadoKYCCod = "N";
			estadoKYCDes = "NUEVO";
		} else if (tipoOperacion.equalsIgnoreCase("A")
				&& kycPersJur.getRazonSocial().equalsIgnoreCase("")) {
			// Es un alta (no trae datos precargados)
			estadoKYCCod = "X";
			estadoKYCDes = "INEXISTENTE";
		} else if (tipoOperacion.equalsIgnoreCase("M")
				&& estadoKYCCod.equalsIgnoreCase("")) {
			// No es un alta (no tiene kyc aprobados)
			estadoKYCCod = "";
			estadoKYCDes = "INEXISTENTE";
		} else {
			// No es un alta (tiene kyc aprobados)
		}
		// Generales
		EstadoKYC estadoKYC = new EstadoKYC();
		estadoKYC.setCodigo(estadoKYCCod);
		estadoKYC.setDescripcion(estadoKYCDes);
		kycPersJur.setEstadoKYC(estadoKYC);
		kycPersJur.setTipoOperacion(tipoOperacion);
		kycPersJur.setVigenciaDesde(vigenciaDesde);
		kycPersJur.setVigenciaHasta(vigenciaHasta);
		// Datos
		String nacionalidadCod = getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_nacionalidad);
		kycPersJur.setFechaConstitucion(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_fechaConstitucion)));
		kycPersJur.setDirCalle(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_dirCalle));
		kycPersJur.setDirNumero(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_dirNumero));
		kycPersJur.setDirPiso(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_dirPiso));
		kycPersJur.setDirDepto(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_dirDepto));
		kycPersJur.setDirLocalidad(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_dirLocalidad));
		Provincia provincia = new Provincia();
		provincia.setId(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_dirProvincia)));
		kycPersJur.setDirProvincia(provincia);
		Integer codigoPostal = Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_dirCodigoPostal));
		kycPersJur.setDirCodigoPostal(codigoPostal.toString());
		kycPersJur.setTelefono(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_telefono));
		kycPersJur.setEmail(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_email));
		// Titular de Medio de Pago
		Integer titMpgTipoDoc = Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_titMpgTipoDoc));
		kycPersJur.setEsTitMPago(titMpgTipoDoc == 0 ? true : false);
		List<TitularMedioPago> titMPagoList = new ArrayList<TitularMedioPago>();
		if (!kycPersJur.getEsTitMPago()) {
			TitularMedioPago titularMedioPago = new TitularMedioPago();
			TipoDoc tipoDocTitMPg = new TipoDoc();
			tipoDocTitMPg.setId(titMpgTipoDoc);
			titularMedioPago.setTipoDoc(tipoDocTitMPg);
			titularMedioPago.setNumeroDoc(Long.parseLong(getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_KYCG_titMpgNumeroDoc)));
			titularMedioPago.setApellido(getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_KYCG_titMpgApellido));
			titularMedioPago.setNombre(getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_KYCG_titMpgNombre));
			titularMedioPago.setMedioPago(getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_KYCG_titMpgMedioPago));
			titMPagoList.add(titularMedioPago);
		} else {
			String titMPgVoid = getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_KYCG_titMpgNumeroDoc
					+ MessageConstants.MSG_RES_KYCG_titMpgApellido
					+ MessageConstants.MSG_RES_KYCG_titMpgNombre
					+ MessageConstants.MSG_RES_KYCG_titMpgMedioPago);
		}
		kycPersJur.setTitMPagoList(titMPagoList);
		Actividad actividad = new Actividad();
		actividad.setId(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_actividadCod)));
		actividad.setName(getField(response, MessageConstants.MSG_TYPE_STRING,
				auxPosicion, MessageConstants.MSG_RES_KYCG_actividadNom));
		kycPersJur.setActividad(actividad);
		Caracter caracter = new Caracter();
		caracter.setId(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_caracterCod)));
		kycPersJur.setCaracter(caracter);
		kycPersJur.setCliRegOrganismo(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_cliRegOrganismo)
				.equalsIgnoreCase("S") ? true : false);
		kycPersJur
		.setEsSCC(getField(response, MessageConstants.MSG_TYPE_STRING,
				auxPosicion, MessageConstants.MSG_RES_KYCG_esSCC)
				.equalsIgnoreCase("S") ? true : false);
		String esPEP = getField(response, MessageConstants.MSG_TYPE_STRING,
				auxPosicion, MessageConstants.MSG_RES_KYCG_esPEP);
		kycPersJur.setEsClienteBco(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_esClienteBco).equalsIgnoreCase(
						"S") ? true : false);
		kycPersJur.setCotizaBolsa(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_cotizaBolsa)
				.equalsIgnoreCase("S") ? true : false);
		kycPersJur.setSubsCiaCotizaBolsa(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_subsCiaCotizaBolsa)
				.equalsIgnoreCase("S") ? true : false);
		String condicionIVAId = getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_condicionIVA);
		String CategoriaMono = getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_categoriaMono);
		// Ingresos
		kycPersJur.setBalFecha(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_ingFecha)));
		String condicionLab = getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_condicionLab);
		Double balActivo = Double.parseDouble(getField(response,
				MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
				MessageConstants.MSG_RES_KYCG_ingImporte1,
				MessageConstants.MSG_RES_KYCG_ingImporte1_DEC));
		Double balPasivo = Double.parseDouble(getField(response,
				MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
				MessageConstants.MSG_RES_KYCG_ingImporte2,
				MessageConstants.MSG_RES_KYCG_ingImporte2_DEC));
		Double balVentas = Double.parseDouble(getField(response,
				MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
				MessageConstants.MSG_RES_KYCG_ingImporte3,
				MessageConstants.MSG_RES_KYCG_ingImporte3_DEC));
		Double balResFinal = Double.parseDouble(getField(response,
				MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
				MessageConstants.MSG_RES_KYCG_ingImporte4,
				MessageConstants.MSG_RES_KYCG_ingImporte4_DEC));
		Double valorOperar = Double.parseDouble(getField(response,
				MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
				MessageConstants.MSG_RES_KYCG_ingImporte5,
				MessageConstants.MSG_RES_KYCG_ingImporte5_DEC));
		Double ingSalMen = Double.parseDouble(getField(response,
				MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
				MessageConstants.MSG_RES_KYCG_ingImporte6,
				MessageConstants.MSG_RES_KYCG_ingImporte6_DEC));
		kycPersJur.setBalActivo(balActivo);
		kycPersJur.setBalPasivo(balPasivo);
		kycPersJur.setBalVentas(balVentas);
		Double balPatNeto = balActivo * 100;
		balPatNeto -= balPasivo * 100;
		balPatNeto = balPatNeto / 100;
		kycPersJur.setBalPatNeto(balPatNeto);
		kycPersJur.setBalResFinal(balResFinal);
		kycPersJur.setBalFechaEstContable(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_fechaEstContables)));
		// Fin ingresos
		kycPersJur.setBalAuditor(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_auditor));
		kycPersJur.setTieneRelHSBC(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_tieneRelHSBC).equalsIgnoreCase(
						"S") ? true : false);
		kycPersJur.setInicioAnn(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_inicioAnn)));
		kycPersJur.setValorOperar(valorOperar);
		kycPersJur.setPrimaAnual(Double.parseDouble(getField(response,
				MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
				MessageConstants.MSG_RES_KYCG_primaAnual,
				MessageConstants.MSG_RES_KYCG_primaAnual_DEC)));
		kycPersJur.setUltFecha(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_ultFecha)));
		// Textos
		kycPersJur.setActividadDes(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_actividadDes));
		kycPersJur.setPropositoDes(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_propositoDes));
		kycPersJur.setMotivoSCC(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_motivoSCC));
		kycPersJur.setDocResDetalle(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_docResDetalle));
		kycPersJur.setRelDetalle(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_relDetalle));
		kycPersJur.setValorOperarMot(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_valorOperarMot));
		kycPersJur.setPerfilComentarios(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_perfilComentarios));
		kycPersJur.setObservaciones(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_observaciones));
		kycPersJur.setAccionistas(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_accionistas));
		kycPersJur.setCaracterDes(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_caracterDes));
		kycPersJur.setSupComentario(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_supComentario));
		kycPersJur.setComComentario(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_comComentario));
		// Representantes
		kycPersJur.setTieneRepSCC(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_tieneRepSCC)
				.equalsIgnoreCase("S") ? true : false);
		Integer cantRep = Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_cantRep));
		List<Representante> representanteList = new ArrayList<Representante>();
		for (int j = 0; j < MessageConstants.MSG_RES_KYCG_representanteList; j++) {
			if (j < cantRep) {
				Representante representante = new Representante();
				TipoDoc tipoDocRep = new TipoDoc();
				tipoDocRep.setId(Integer.parseInt(getField(response,
						MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
						MessageConstants.MSG_RES_KYCG_RepTipoDoc)));
				representante.setTipoDoc(tipoDocRep);
				representante.setNumeroDoc(Integer.parseInt(getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_RepNumeroDoc)));
				representante.setApellido(getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_RepApellido));
				representante.setNombre(getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_RepNombre));
				representante.setCargo(getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_RepCargo));
				representante.setEsSCC(getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_RepEsSCC)
						.equalsIgnoreCase("S") ? true : false);
				representante.setEsPEP(getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_RepEsPEP)
						.equalsIgnoreCase("S") ? true : false);
				representante.setFechaConstitNacim(Integer
						.parseInt(getField(response,
								MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
								MessageConstants.MSG_RES_KYCG_RepFechaNac)));
				representanteList.add(representante);
			} else {
				String repVoid = getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_RepTipoDoc
						+ MessageConstants.MSG_RES_KYCG_RepNumeroDoc
						+ MessageConstants.MSG_RES_KYCG_RepApellido
						+ MessageConstants.MSG_RES_KYCG_RepNombre
						+ MessageConstants.MSG_RES_KYCG_RepCargo
						+ MessageConstants.MSG_RES_KYCG_RepEsSCC
						+ MessageConstants.MSG_RES_KYCG_RepEsPEP
						+ MessageConstants.MSG_RES_KYCG_RepFechaNac);
			}
		}
		kycPersJur.setRepresentanteList(representanteList);
		// Operaciones Inusuales
		Integer cantOIn = Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_cantOIn));
		List<OperacionInusual> opeInusualList = new ArrayList<OperacionInusual>();
		for (int j = 0; j < MessageConstants.MSG_RES_KYCG_opeInusualList; j++) {
			if (j < cantOIn) {
				OperacionInusual operacionInusual = new OperacionInusual();
				operacionInusual.setSecuencia(Integer
						.parseInt(getField(response,
								MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
								MessageConstants.MSG_RES_KYCG_OInSecuencia)));
				operacionInusual.setFecha(Integer.parseInt(getField(response,
						MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
						MessageConstants.MSG_RES_KYCG_OInFecha)));
				operacionInusual.setTipoOperacion(getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_OInTipoOperacion));
				operacionInusual.setOrigenFondos(getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_OInOrigenFondos));
				operacionInusual.setMonto(Double.parseDouble(getField(response,
						MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
						MessageConstants.MSG_RES_KYCG_OInMonto,
						MessageConstants.MSG_RES_KYCG_OInMonto_DEC)));
				operacionInusual.setObservacion(getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_OInObservacion));
				opeInusualList.add(operacionInusual);
			} else {
				String oinVoid = getField(
						response,
						MessageConstants.MSG_TYPE_STRING,
						auxPosicion,
						MessageConstants.MSG_RES_KYCG_OInSecuencia
						+ MessageConstants.MSG_RES_KYCG_OInFecha
						+ MessageConstants.MSG_RES_KYCG_OInTipoOperacion
						+ MessageConstants.MSG_RES_KYCG_OInOrigenFondos
						+ MessageConstants.MSG_RES_KYCG_OInMonto
						+ MessageConstants.MSG_RES_KYCG_OInObservacion);
			}
		}
		kycPersJur.setOpeInusualList(opeInusualList);
		// Companias
		Integer cantCia = Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_cantCia));
		List<Compania> companiaList = new ArrayList<Compania>();
		for (int j = 0; j < MessageConstants.MSG_RES_KYCG_companiaList; j++) {
			if (j < cantCia) {
				Compania compania = new Compania();
				compania.setSecuencia(j + 1);
				compania.setRazonSocial(getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_CiaCompania));
				compania.setEsSCC(getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_CiaEsSCC)
						.equalsIgnoreCase("S") ? true : false);
				compania.setFechaConstitucion(Integer
						.parseInt(getField(response,
								MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
								MessageConstants.MSG_RES_KYCG_CiaFechaCons)));
				companiaList.add(compania);
			} else {
				String ciaVoid = getField(response,
						MessageConstants.MSG_TYPE_STRING, auxPosicion,
						MessageConstants.MSG_RES_KYCG_CiaCompania
						+ MessageConstants.MSG_RES_KYCG_CiaEsSCC
						+ MessageConstants.MSG_RES_KYCG_CiaFechaCons);
			}
		}
		kycPersJur.setCompaniaList(companiaList);
		// Otros Datos
		AuthorizedUser operador = new AuthorizedUser();
		operador.setPeopleSoft(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_opePeopleSoft));
		operador.setlName(getField(response, MessageConstants.MSG_TYPE_STRING,
				auxPosicion, MessageConstants.MSG_RES_KYCG_opeLName));
		operador.setfName(getField(response, MessageConstants.MSG_TYPE_STRING,
				auxPosicion, MessageConstants.MSG_RES_KYCG_opeFName));
		operador.setProfileKey(KYCSegConstants.KYCS_USRPROF_OPE);
		kycPersJur.setOperador(operador);
		kycPersJur.setOpeFechaUpd(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_opeFechaUpd)));
		AuthorizedUser supervisor = new AuthorizedUser();
		supervisor.setPeopleSoft(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_supPeopleSoft));
		supervisor.setlName(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_supLName));
		supervisor.setfName(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_supFName));
		supervisor.setProfileKey(KYCSegConstants.KYCS_USRPROF_SUP);
		kycPersJur.setSupervisor(supervisor);
		kycPersJur.setSupFechaUpd(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_supFechaUpd)));
		AuthorizedUser compliance = new AuthorizedUser();
		compliance.setPeopleSoft(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_comPeopleSoft));
		compliance.setlName(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_comLName));
		compliance.setfName(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCG_comFName));
		compliance.setProfileKey(KYCSegConstants.KYCS_USRPROF_COM);
		kycPersJur.setCompliance(compliance);
		kycPersJur.setComFechaUpd(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCG_comFechaUpd)));

		return kycPersJur;
	}

	// Set KYC Personas Juridicas (Request)
	public static String reqMFSetKYCPersJur(final KYCPersJur kycPersJur,
			final String tipoOperacion, final Boolean actPerfilTrans,
			final Boolean esKYCNuevo, final Integer vigenciaDesde,
			final Integer vigenciaHasta, final Boolean perfilObligenAIS,
			final AuthorizedUser operador, final AuthorizedUser supervisor) {
		String reqMF = "";
		reqMF += setHeader(MessageConstants.MSG_KYCS_MessageID);
		reqMF += setField(kycPersJur.getNumeroCUIT().toString(),
				MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_numeroCUIL);
		reqMF += setField(tipoOperacion, MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_tipoOperacion);
		if (actPerfilTrans
				|| (!perfilObligenAIS && kycPersJur.getEsSCC() && vigenciaDesde == 0)) {
			reqMF += setField("99999999", MessageConstants.MSG_TYPE_NUMERIC,
					MessageConstants.MSG_REQ_KYCS_vigenciaDesde);
			reqMF += setField("99999999", MessageConstants.MSG_TYPE_NUMERIC,
					MessageConstants.MSG_REQ_KYCS_vigenciaHasta);
		} else {
			reqMF += setField(vigenciaDesde.toString(),
					MessageConstants.MSG_TYPE_NUMERIC,
					MessageConstants.MSG_REQ_KYCS_vigenciaDesde);
			reqMF += setField(vigenciaHasta.toString(),
					MessageConstants.MSG_TYPE_NUMERIC,
					MessageConstants.MSG_REQ_KYCS_vigenciaHasta);
		}
		if (actPerfilTrans || esKYCNuevo) {
			reqMF += setField("A", MessageConstants.MSG_TYPE_STRING,
					MessageConstants.MSG_REQ_KYCS_estadoCod);
		} else {
			reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
					MessageConstants.MSG_REQ_KYCS_estadoCod);
		}
		reqMF += setField(perfilObligenAIS ? "S" : "N",
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_perfilObligenAIS);
		reqMF += setField(operador.getPeopleSoft(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_opePeopleSoft);
		reqMF += setField(operador.getlName(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_opeLName);
		reqMF += setField(operador.getfName(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_opeFName);
		reqMF += setField(supervisor.getPeopleSoft(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_supPeopleSoft);
		reqMF += setField(supervisor.getlName(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_supLName);
		reqMF += setField(supervisor.getfName(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_supFName);
		reqMF += setField("J", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_tipoPersona);
		reqMF += setField("0", MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_tipoDoc);
		reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_numeroDoc);
		reqMF += setField(kycPersJur.getRazonSocial(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_apellido
				+ MessageConstants.MSG_REQ_KYCS_nombre);
		reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_nacionalidad);
		reqMF += setField(kycPersJur.getFechaConstitucion().toString(),
				MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_fechaConstitucion);
		reqMF += setField(kycPersJur.getDirCalle(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_dirCalle);
		reqMF += setField(kycPersJur.getDirNumero(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_dirNumero);
		reqMF += setField(kycPersJur.getDirPiso(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_dirPiso);
		reqMF += setField(kycPersJur.getDirDepto(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_dirDepto);
		reqMF += setField(kycPersJur.getDirLocalidad(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_dirLocalidad);
		reqMF += setField(kycPersJur.getDirProvincia().getId().toString(),
				MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_dirProvincia);
		reqMF += setField(kycPersJur.getDirCodigoPostal(),
				MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_dirCodigoPostal);
		reqMF += setField(kycPersJur.getTelefono(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_telefono);
		reqMF += setField(kycPersJur.getEmail(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_email);
		if (!kycPersJur.getEsTitMPago()) {
			TitularMedioPago titularMedioPago = kycPersJur.getTitMPagoList()
					.get(0);
			reqMF += setField(titularMedioPago.getTipoDoc().getId().toString(),
					MessageConstants.MSG_TYPE_NUMERIC,
					MessageConstants.MSG_REQ_KYCS_titMpgTipoDoc);
			reqMF += setField(titularMedioPago.getNumeroDoc().toString(),
					MessageConstants.MSG_TYPE_STRING,
					MessageConstants.MSG_REQ_KYCS_titMpgNumeroDoc);
			reqMF += setField(titularMedioPago.getApellido(),
					MessageConstants.MSG_TYPE_STRING,
					MessageConstants.MSG_REQ_KYCS_titMpgApellido);
			reqMF += setField(titularMedioPago.getNombre(),
					MessageConstants.MSG_TYPE_STRING,
					MessageConstants.MSG_REQ_KYCS_titMpgNombre);
			reqMF += setField(titularMedioPago.getMedioPago(),
					MessageConstants.MSG_TYPE_STRING,
					MessageConstants.MSG_REQ_KYCS_titMpgMedioPago);
		} else {
			reqMF += setField("0", MessageConstants.MSG_TYPE_NUMERIC,
					MessageConstants.MSG_REQ_KYCS_titMpgTipoDoc);
			reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
					MessageConstants.MSG_REQ_KYCS_titMpgNumeroDoc);
			reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
					MessageConstants.MSG_REQ_KYCS_titMpgApellido);
			reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
					MessageConstants.MSG_REQ_KYCS_titMpgNombre);
			reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
					MessageConstants.MSG_REQ_KYCS_titMpgMedioPago);
		}
		reqMF += setField(kycPersJur.getActividad().getId().toString(),
				MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_actividadCod);
		reqMF += setField(kycPersJur.getCaracter().getId().toString(),
				MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_caracterCod);
		reqMF += setField(kycPersJur.getCliRegOrganismo() ? "S" : "N",
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_cliRegOrganismo);
		reqMF += setField(kycPersJur.getEsSCC() ? "S" : "N",
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_esSCC);
		reqMF += setField("N", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_esPEP);
		reqMF += setField(kycPersJur.getEsClienteBco() ? "S" : "N",
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_esClienteBco);
		reqMF += setField(kycPersJur.getCotizaBolsa() ? "S" : "N",
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_cotizaBolsa);
		reqMF += setField(kycPersJur.getSubsCiaCotizaBolsa() ? "S" : "N",
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_subsCiaCotizaBolsa);
		reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_condicionIVA);
		reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_categoriaMono);
		// Ingresos
		reqMF += setField(kycPersJur.getBalFecha().toString(),
				MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_ingFecha);
		reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_condicionLab);
		reqMF += setField(
				String.format(Locale.US, "%f", kycPersJur.getBalActivo()),
				MessageConstants.MSG_TYPE_DECIMAL,
				MessageConstants.MSG_REQ_KYCS_ingImporte1,
				MessageConstants.MSG_REQ_KYCS_ingImporte1_DEC);
		reqMF += setField(
				String.format(Locale.US, "%f", kycPersJur.getBalPasivo()),
				MessageConstants.MSG_TYPE_DECIMAL,
				MessageConstants.MSG_REQ_KYCS_ingImporte2,
				MessageConstants.MSG_REQ_KYCS_ingImporte2_DEC);
		reqMF += setField(
				String.format(Locale.US, "%f", kycPersJur.getBalVentas()),
				MessageConstants.MSG_TYPE_DECIMAL,
				MessageConstants.MSG_REQ_KYCS_ingImporte3,
				MessageConstants.MSG_REQ_KYCS_ingImporte3_DEC);
		reqMF += setField(
				String.format(Locale.US, "%f", kycPersJur.getBalResFinal()),
				MessageConstants.MSG_TYPE_DECIMAL,
				MessageConstants.MSG_REQ_KYCS_ingImporte4,
				MessageConstants.MSG_REQ_KYCS_ingImporte4_DEC);
		reqMF += setField(
				String.format(Locale.US, "%f", kycPersJur.getValorOperar()),
				MessageConstants.MSG_TYPE_DECIMAL,
				MessageConstants.MSG_REQ_KYCS_ingImporte5,
				MessageConstants.MSG_REQ_KYCS_ingImporte5_DEC);
		reqMF += setField(String.format(Locale.US, "%f", new Double(0)),
				MessageConstants.MSG_TYPE_DECIMAL,
				MessageConstants.MSG_REQ_KYCS_ingImporte6,
				MessageConstants.MSG_REQ_KYCS_ingImporte6_DEC);
		reqMF += setField(kycPersJur.getBalFechaEstContable().toString(),
				MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_fechaEstContables);
		reqMF += setField(kycPersJur.getBalAuditor(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_auditor);
		reqMF += setField(kycPersJur.getInicioAnn().toString(),
				MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_inicioAnn);
		reqMF += setField(
				String.format(Locale.US, "%f", kycPersJur.getPrimaAnual()),
				MessageConstants.MSG_TYPE_DECIMAL,
				MessageConstants.MSG_REQ_KYCS_primaAnual,
				MessageConstants.MSG_REQ_KYCS_primaAnual_DEC);
		reqMF += setField(kycPersJur.getUltFecha().toString(),
				MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCS_ultFecha);
		// Textos
		reqMF += setField(kycPersJur.getActividadDes(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_actividadDes);
		reqMF += setField(kycPersJur.getPropositoDes(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_propositoDes);
		reqMF += setField(kycPersJur.getMotivoSCC(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_motivoSCC);
		reqMF += setField(kycPersJur.getDocResDetalle(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_docResDetalle);
		reqMF += setField(kycPersJur.getRelDetalle(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_relDetalle);
		reqMF += setField(kycPersJur.getValorOperarMot(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_valorOperarMot);
		reqMF += setField(kycPersJur.getPerfilComentarios(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_perfilComentarios);
		reqMF += setField(".", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_perfilComentarios_Filler);
		reqMF += setField(kycPersJur.getObservaciones(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_observaciones);
		reqMF += setField(kycPersJur.getAccionistas(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_accionistas);
		reqMF += setField(kycPersJur.getCaracterDes(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_caracterDes);
		// Representantes
		List<Representante> representanteList = kycPersJur
				.getRepresentanteList();
		for (int j = 0; j < MessageConstants.MSG_REQ_KYCS_representanteList; j++) {
			if (j < representanteList.size()) {
				reqMF += setField(representanteList.get(j).getTipoDoc().getId()
						.toString(), MessageConstants.MSG_TYPE_NUMERIC,
						MessageConstants.MSG_REQ_KYCS_RepTipoDoc);
				reqMF += setField(representanteList.get(j).getNumeroDoc()
						.toString(), MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepNumeroDoc);
				reqMF += setField(representanteList.get(j).getApellido(),
						MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepApellido);
				reqMF += setField(representanteList.get(j).getNombre(),
						MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepNombre);
				reqMF += setField(representanteList.get(j).getCargo(),
						MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepCargo);
				reqMF += setField(representanteList.get(j).getEsSCC() ? "S"
						: "N", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepEsSCC);
				reqMF += setField(representanteList.get(j).getEsPEP() ? "S"
						: "N", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepEsPEP);
				reqMF += setField(representanteList.get(j)
						.getFechaConstitNacim().toString(),
						MessageConstants.MSG_TYPE_NUMERIC,
						MessageConstants.MSG_REQ_KYCS_RepFechaNac);
			} else {
				reqMF += setField("0", MessageConstants.MSG_TYPE_NUMERIC,
						MessageConstants.MSG_REQ_KYCS_RepTipoDoc);
				reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepNumeroDoc);
				reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepApellido);
				reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepNombre);
				reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepCargo);
				reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepEsSCC);
				reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_RepEsPEP);
				reqMF += setField("0", MessageConstants.MSG_TYPE_NUMERIC,
						MessageConstants.MSG_REQ_KYCS_RepFechaNac);
			}
		}
		// Operaciones Inusuales
		List<OperacionInusual> opeInusualList = kycPersJur.getOpeInusualList();
		for (int j = 0; j < MessageConstants.MSG_REQ_KYCS_opeInusualList; j++) {
			if (j < opeInusualList.size()) {
				reqMF += setField(opeInusualList.get(j).getFecha().toString(),
						MessageConstants.MSG_TYPE_NUMERIC,
						MessageConstants.MSG_REQ_KYCS_OInFecha);
				reqMF += setField(opeInusualList.get(j).getTipoOperacion(),
						MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_OInTipoOperacion);
				reqMF += setField(opeInusualList.get(j).getOrigenFondos(),
						MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_OInOrigenFondos);
				reqMF += setField(String.format(Locale.US, "%f", opeInusualList
						.get(j).getMonto()), MessageConstants.MSG_TYPE_DECIMAL,
						MessageConstants.MSG_REQ_KYCS_OInMonto,
						MessageConstants.MSG_REQ_KYCS_OInMonto_DEC);
				reqMF += setField(opeInusualList.get(j).getObservacion(),
						MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_OInObservacion);
			} else {
				reqMF += setField("0", MessageConstants.MSG_TYPE_NUMERIC,
						MessageConstants.MSG_REQ_KYCS_OInFecha);
				reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_OInTipoOperacion);
				reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_OInOrigenFondos);
				reqMF += setField("0.00", MessageConstants.MSG_TYPE_DECIMAL,
						MessageConstants.MSG_REQ_KYCS_OInMonto,
						MessageConstants.MSG_REQ_KYCS_OInMonto_DEC);
				reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_OInObservacion);
			}
		}
		// Companias
		List<Compania> companiaList = kycPersJur.getCompaniaList();
		for (int j = 0; j < MessageConstants.MSG_REQ_KYCS_companiaList; j++) {
			if (j < companiaList.size()) {
				reqMF += setField(companiaList.get(j).getRazonSocial(),
						MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_CiaCompania);
				reqMF += setField(companiaList.get(j).getEsSCC() ? "S" : "N",
						MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_CiaEsSCC);
				reqMF += setField(companiaList.get(j).getFechaConstitucion()
						.toString(), MessageConstants.MSG_TYPE_NUMERIC,
						MessageConstants.MSG_REQ_KYCS_CiaFechaCons);
			} else {
				reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_CiaCompania);
				reqMF += setField(".", MessageConstants.MSG_TYPE_STRING,
						MessageConstants.MSG_REQ_KYCS_CiaEsSCC);
				reqMF += setField("0", MessageConstants.MSG_TYPE_NUMERIC,
						MessageConstants.MSG_REQ_KYCS_CiaFechaCons);
			}
		}
		// Fin
		reqMF += setField(".", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCS_Fin);

		return reqMF;
	}

	// Set KYC Personas Juridicas (Response)
	public static KYCSetResp resMFSetKYCPersJur(final String response) {
		KYCSetResp kycSetResp = new KYCSetResp();
		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_KYCS_INI);
		kycSetResp.setEstadoGra(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCS_estadoGra)));
		kycSetResp.setEstadoAsi(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCS_estadoAsi)));
		EstadoKYC estadoKYC = new EstadoKYC();
		estadoKYC.setCodigo(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCS_estadoCod));
		estadoKYC.setDescripcion(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCS_estadoDes));
		kycSetResp.setEstadoKYC(estadoKYC);
		return kycSetResp;
	}

	// Get KYC Pendiente (Request)
	public static String reqMFGetKYCPendienteList(final String estadoKYC,
			final String profileKey, final String peopleSoft) {
		String reqMF = "";
		reqMF += setHeader(MessageConstants.MSG_KYCL_MessageID);
		reqMF += setField(profileKey, MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCL_profileKey);
		reqMF += setField(peopleSoft, MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCL_peopleSoft);
		reqMF += setField(estadoKYC, MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCL_estado1);
		reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCL_estado2);
		reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCL_estado3);
		reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCL_estado4);
		reqMF += setField("", MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCL_estado5);
		return reqMF;
	}

	// Get KYC Pendiente (Response)
	public static List<KYCPendiente> resMFGetKYCPendienteList(
			final String response) {
		List<KYCPendiente> kycPendienteList = null;

		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_KYCL_INI);
		Integer cantKYC = Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCL_canKYC));
		kycPendienteList = new ArrayList<KYCPendiente>();
		for (int i = 0; i < cantKYC; i++) {
			KYCPendiente kycPendiente = new KYCPendiente();
			kycPendiente.setTipoPersona(getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_KYCL_tipoPersona));
			kycPendiente.setUltFecha(Integer.parseInt(getField(response,
					MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
					MessageConstants.MSG_RES_KYCL_ultFecha)));
			kycPendiente.setNumeroCUIL(Long.parseLong(getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_KYCL_numeroCUIL)));
			kycPendiente.setApellido(getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_KYCL_apellido));
			kycPendiente.setNombre(getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_KYCL_nombre));
			EstadoKYC estadoKYC = new EstadoKYC();
			estadoKYC.setCodigo(getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_KYCL_estadoCod));
			estadoKYC.setDescripcion(getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_KYCL_estadoDes));
			kycPendiente.setEstadoKYC(estadoKYC);
			kycPendiente.setPeopleSoft(getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_KYCL_peopleSoft));
			kycPendiente.setlName(getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_KYCL_lName));
			kycPendiente.setfName(getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_KYCL_fName));
			kycPendiente.setPrimaAnual(Double.parseDouble(getField(response,
					MessageConstants.MSG_TYPE_DECIMAL, auxPosicion,
					MessageConstants.MSG_RES_KYCL_primaAnual,
					MessageConstants.MSG_RES_KYCL_primaAnual_DEC)));
			kycPendiente.setCategCliente(Integer.parseInt(getField(response,
					MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
					MessageConstants.MSG_RES_KYCL_categCliente))); // PPCR_2015-00142_(ENS)
			kycPendiente.setDescCategCli(getField(response,
					MessageConstants.MSG_TYPE_STRING, auxPosicion,
					MessageConstants.MSG_RES_KYCL_descCategCli)); // PPCR_2015-00142_(ENS)
			kycPendienteList.add(kycPendiente);
		}

		return kycPendienteList;
	}

	// Set KYC Pendiente (Request)
	public static String reqMFSetKYCPendiente(final Long numeroCUIL,
			final String tipoOperacion, final String estadoKYC,
			final AuthorizedUser user,
			final Double primaAnual, // Nota:_primaAnual_no_se_usa(ENS)
			final Integer categCliente, final String categCGS,
			final String comentario) {
		String reqMF = "";
		reqMF += setHeader(MessageConstants.MSG_KYCU_MessageID);
		reqMF += setField(numeroCUIL.toString(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCU_numeroCUIL);
		reqMF += setField(tipoOperacion, MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCU_tipoOperacion);
		reqMF += setField(estadoKYC, MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCU_estadoCod);
		reqMF += setField(user.getProfileKey(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCU_profileKey);
		reqMF += setField(user.getPeopleSoft(),
				MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCU_peopleSoft);
		reqMF += setField(user.getlName(), MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCU_lName);
		reqMF += setField(user.getfName(), MessageConstants.MSG_TYPE_STRING,
				MessageConstants.MSG_REQ_KYCU_fName);
		reqMF += setField(categCliente.toString(),
				MessageConstants.MSG_TYPE_NUMERIC,
				MessageConstants.MSG_REQ_KYCU_categCli);
		reqMF += setField(categCGS, MessageConstants.MSG_TYPE_STRING, // PPCR_2015-00142_(ENS)
				MessageConstants.MSG_REQ_KYCU_categCGS);
		reqMF += setField(comentario, MessageConstants.MSG_TYPE_STRING, // PPCR_2015-00142_(ENS)
				MessageConstants.MSG_REQ_KYCU_comentario);
		return reqMF;
	}

	// Set KYC Pendiente (Response)
	public static KYCSetResp resMFSetKYCPendiente(final String response) {
		KYCSetResp kycSetResp = new KYCSetResp();
		Auxiliar auxPosicion = new Auxiliar();
		auxPosicion.setNumber(MessageConstants.MSG_RES_KYCU_INI);
		kycSetResp.setEstadoGra(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCU_estadoGra)));
		kycSetResp.setEstadoAsi(Integer.parseInt(getField(response,
				MessageConstants.MSG_TYPE_NUMERIC, auxPosicion,
				MessageConstants.MSG_RES_KYCU_estadoAsi)));
		EstadoKYC estadoKYC = new EstadoKYC();
		estadoKYC.setCodigo(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCU_estadoCod));
		estadoKYC.setDescripcion(getField(response,
				MessageConstants.MSG_TYPE_STRING, auxPosicion,
				MessageConstants.MSG_RES_KYCU_estadoDes));
		kycSetResp.setEstadoKYC(estadoKYC);
		return kycSetResp;
	}
}
