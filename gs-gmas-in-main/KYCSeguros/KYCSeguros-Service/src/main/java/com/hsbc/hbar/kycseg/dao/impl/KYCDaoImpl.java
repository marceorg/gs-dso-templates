/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2013. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.kycseg.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.jdbc.object.StoredProcedure;

import com.hsbc.hbar.kycseg.dao.KYCDao;
import com.hsbc.hbar.kycseg.model.common.Actividad;
import com.hsbc.hbar.kycseg.model.common.AuthorizedUser;
import com.hsbc.hbar.kycseg.model.common.Caracter;
import com.hsbc.hbar.kycseg.model.common.CondicionIVA;
import com.hsbc.hbar.kycseg.model.common.Pais;
import com.hsbc.hbar.kycseg.model.common.Provincia;
import com.hsbc.hbar.kycseg.model.common.TipoDoc;
import com.hsbc.hbar.kycseg.model.kyc.Compania;
import com.hsbc.hbar.kycseg.model.kyc.EstadoKYC;
import com.hsbc.hbar.kycseg.model.kyc.KYCPersFis;
import com.hsbc.hbar.kycseg.model.kyc.KYCPersJur;
import com.hsbc.hbar.kycseg.model.kyc.OperacionInusual;
import com.hsbc.hbar.kycseg.model.kyc.Representante;
import com.hsbc.hbar.kycseg.model.kyc.TitularMedioPago;

public class KYCDaoImpl implements KYCDao {
	static Logger logger = LogManager.getLogger(KYCDaoImpl.class);

	private DataSource dataSource;

	public void setDataSource(final DataSource datasource) {
		this.dataSource = datasource;
	}

	public DataSource getDataSource() {
		return this.dataSource;
	}

	public List<Representante> getKYCRepList(final Long numeroCUIL) {
		try {
			P_KS_OPE_KYCREP_SEL sproc = new P_KS_OPE_KYCREP_SEL(this.dataSource);
			Map resRep = sproc.execute(numeroCUIL);
			return (List<Representante>) resRep.get("Resultado");
		} catch (Exception e) {
			KYCDaoImpl.logger.error(e);
			return null;
		}
	}

	public class P_KS_OPE_KYCREP_SEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_KS_OPE_KYCREP_SEL";
		private static final String PARAM_NUM_CUI = "NUM_CUI";

		public P_KS_OPE_KYCREP_SEL(final DataSource dataSource) {
			super(dataSource, P_KS_OPE_KYCREP_SEL.SPROC_NAME);
			declareParameter(new SqlParameter(P_KS_OPE_KYCREP_SEL.PARAM_NUM_CUI, Types.NUMERIC));

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					Representante representante = new Representante();
					TipoDoc tipoDoc = new TipoDoc();
					tipoDoc.setId(rs.getInt("KRE_TIP_DOC"));
					tipoDoc.setName(rs.getString("KRE_DES_DOC"));
					representante.setTipoDoc(tipoDoc);
					representante.setNumeroDoc(rs.getInt("KRE_NUM_DOC"));
					representante.setApellido(rs.getString("KRE_APE_REP"));
					representante.setNombre(rs.getString("KRE_NOM_REP"));
					representante.setEsSCC(rs.getBoolean("KRE_SCC_REP"));
					representante.setCargo(rs.getString("KRE_CRG_REP"));
					representante.setEsPEP(rs.getBoolean("KRE_PEP_REP"));
					representante.setFechaConstitNacim(rs.getInt("KRE_FEC_CON"));
					return representante;
				};
			}));
			compile();
		}

		public Map execute(final Long numeroCUIL) {
			Map inpRep = new HashMap();
			inpRep.put(P_KS_OPE_KYCREP_SEL.PARAM_NUM_CUI, new Long(numeroCUIL));
			return super.execute(inpRep);
		}
	}

	public List<TitularMedioPago> getKYCTitMPgList(final Long numeroCUIL) {
		try {
			P_KS_OPE_KYCTITMPG_SEL sproc = new P_KS_OPE_KYCTITMPG_SEL(this.dataSource);
			Map resTMP = sproc.execute(numeroCUIL);
			return (List<TitularMedioPago>) resTMP.get("Resultado");
		} catch (Exception e) {
			KYCDaoImpl.logger.error(e);
			return null;
		}
	}

	public class P_KS_OPE_KYCTITMPG_SEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_KS_OPE_KYCTITMPG_SEL";
		private static final String PARAM_NUM_CUI = "NUM_CUI";

		public P_KS_OPE_KYCTITMPG_SEL(final DataSource dataSource) {
			super(dataSource, P_KS_OPE_KYCTITMPG_SEL.SPROC_NAME);
			declareParameter(new SqlParameter(P_KS_OPE_KYCTITMPG_SEL.PARAM_NUM_CUI, Types.NUMERIC));

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					TitularMedioPago titularMedioPago = new TitularMedioPago();
					TipoDoc tipoDoc = new TipoDoc();
					tipoDoc.setId(rs.getInt("KTM_TIP_DOC"));
					tipoDoc.setName(rs.getString("KTM_DES_DOC"));
					titularMedioPago.setTipoDoc(tipoDoc);
					titularMedioPago.setNumeroDoc(rs.getLong("KTM_NUM_DOC"));
					titularMedioPago.setApellido(rs.getString("KTM_APE_TMP"));
					titularMedioPago.setNombre(rs.getString("KTM_NOM_TMP"));
					titularMedioPago.setMedioPago(rs.getString("KTM_MED_PAG"));
					return titularMedioPago;
				};
			}));
			compile();
		}

		public Map execute(final Long numeroCUIL) {
			Map inpTMP = new HashMap();
			inpTMP.put(P_KS_OPE_KYCTITMPG_SEL.PARAM_NUM_CUI, new Long(numeroCUIL));
			return super.execute(inpTMP);
		}
	}

	public List<OperacionInusual> getKYCOInList(final Long numeroCUIL) {
		try {
			P_KS_OPE_KYCOPEINU_SEL sproc = new P_KS_OPE_KYCOPEINU_SEL(this.dataSource);
			Map resOpI = sproc.execute(numeroCUIL);
			return (List<OperacionInusual>) resOpI.get("Resultado");
		} catch (Exception e) {
			KYCDaoImpl.logger.error(e);
			return null;
		}
	}

	public class P_KS_OPE_KYCOPEINU_SEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_KS_OPE_KYCOPEINU_SEL";
		private static final String PARAM_NUM_CUI = "NUM_CUI";

		public P_KS_OPE_KYCOPEINU_SEL(final DataSource dataSource) {
			super(dataSource, P_KS_OPE_KYCOPEINU_SEL.SPROC_NAME);
			declareParameter(new SqlParameter(P_KS_OPE_KYCOPEINU_SEL.PARAM_NUM_CUI, Types.NUMERIC));

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					OperacionInusual operacionInusual = new OperacionInusual();
					operacionInusual.setSecuencia(rs.getInt("KOI_NUM_SEC"));
					operacionInusual.setFecha(rs.getInt("KOI_FEC_OIN"));
					operacionInusual.setTipoOperacion(rs.getString("KOI_TIP_OPE"));
					operacionInusual.setOrigenFondos(rs.getString("KOI_ORI_FON"));
					operacionInusual.setMonto(rs.getDouble("KOI_MON_OIN"));
					operacionInusual.setObservacion(rs.getString("KOI_OBS_OIN"));
					return operacionInusual;
				};
			}));
			compile();
		}

		public Map execute(final Long numeroCUIL) {
			Map inpOpI = new HashMap();
			inpOpI.put(P_KS_OPE_KYCOPEINU_SEL.PARAM_NUM_CUI, new Long(numeroCUIL));
			return super.execute(inpOpI);
		}
	}

	public List<Compania> getKYCCiaList(final Long numeroCUIL) {
		try {
			P_KS_OPE_KYCCIA_SEL sproc = new P_KS_OPE_KYCCIA_SEL(this.dataSource);
			Map resCia = sproc.execute(numeroCUIL);
			return (List<Compania>) resCia.get("Resultado");
		} catch (Exception e) {
			KYCDaoImpl.logger.error(e);
			return null;
		}
	}

	public class P_KS_OPE_KYCCIA_SEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_KS_OPE_KYCCIA_SEL";
		private static final String PARAM_NUM_CUI = "NUM_CUI";

		public P_KS_OPE_KYCCIA_SEL(final DataSource dataSource) {
			super(dataSource, P_KS_OPE_KYCCIA_SEL.SPROC_NAME);
			declareParameter(new SqlParameter(P_KS_OPE_KYCCIA_SEL.PARAM_NUM_CUI, Types.NUMERIC));

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					Compania compania = new Compania();
					compania.setSecuencia(rs.getInt("KCI_NUM_SEC"));
					compania.setRazonSocial(rs.getString("KCI_RAZ_SOC"));
					compania.setEsSCC(rs.getBoolean("KCI_SCC_CIA"));
					compania.setFechaConstitucion(rs.getInt("KCI_FEC_CON"));
					return compania;
				};
			}));
			compile();
		}

		public Map execute(final Long numeroCUIL) {
			Map inpCia = new HashMap();
			inpCia.put(P_KS_OPE_KYCCIA_SEL.PARAM_NUM_CUI, new Long(numeroCUIL));
			return super.execute(inpCia);
		}
	}

	public List<KYCPersFis> getKYCPersFis(final Long numeroCUIL) {
		try {
			// Datos recuperados
			P_KS_OPE_KYCDATOS_SEL spREC = new P_KS_OPE_KYCDATOS_SEL(this.dataSource, new KYCPersFis());
			Map resultsREC = spREC.execute(numeroCUIL);
			return (List<KYCPersFis>) resultsREC.get("Resultado");
		} catch (Exception e) {
			KYCDaoImpl.logger.error(e);
			return null;
		}
	}

	public List<KYCPersJur> getKYCPersJur(final Long numeroCUIT) {
		try {
			// Datos recuperados
			P_KS_OPE_KYCDATOS_SEL spREC = new P_KS_OPE_KYCDATOS_SEL(this.dataSource, new KYCPersJur());
			Map resultsREC = spREC.execute(numeroCUIT);
			return (List<KYCPersJur>) resultsREC.get("Resultado");
		} catch (Exception e) {
			KYCDaoImpl.logger.error(e);
			return null;
		}
	}

	public class P_KS_OPE_KYCDATOS_SEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_KS_OPE_KYCDATOS_SEL";
		private static final String PARAM_NUM_CUI = "NUM_CUI";

		public P_KS_OPE_KYCDATOS_SEL(final DataSource dataSource, final KYCPersFis kycPersFisPar) {
			super(dataSource, P_KS_OPE_KYCDATOS_SEL.SPROC_NAME);
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_SEL.PARAM_NUM_CUI, Types.NUMERIC));

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					KYCPersFis kycPersFis = new KYCPersFis();
					// Generales
					EstadoKYC estadoKYC = new EstadoKYC();
					estadoKYC.setCodigo(rs.getString("KYC_COD_EST"));
					estadoKYC.setDescripcion(rs.getString("KYC_DES_EST"));
					kycPersFis.setEstadoKYC(estadoKYC);
					// Panel 1
					TipoDoc tipoDoc = new TipoDoc();
					tipoDoc.setId(rs.getInt("KYC_NUM_TDO"));
					tipoDoc.setName(rs.getString("KYC_DES_TDO"));
					kycPersFis.setTipoDoc(tipoDoc);
					kycPersFis.setNumeroDoc(rs.getLong("KYC_NUM_DOC"));
					kycPersFis.setNumeroCUIL(rs.getLong("KYC_NUM_CUI"));
					kycPersFis.setApellido(rs.getString("KYC_APE_CLI"));
					kycPersFis.setNombre(rs.getString("KYC_NOM_CLI"));
					Pais nacionalidad = new Pais();
					nacionalidad.setId(rs.getInt("KYC_COD_NAC"));
					nacionalidad.setName(rs.getString("KYC_DES_NAC"));
					kycPersFis.setNacionalidad(nacionalidad);
					kycPersFis.setFechaNacimiento(rs.getInt("KYC_FEC_CON")); // PPCR_2015-00142_(ENS)
					kycPersFis.setDirCalle(rs.getString("KYC_DIR_CAL"));
					kycPersFis.setDirNumero(rs.getString("KYC_DIR_NUM"));
					kycPersFis.setDirPiso(rs.getString("KYC_DIR_PIS"));
					kycPersFis.setDirDepto(rs.getString("KYC_DIR_DTO"));
					Provincia provincia = new Provincia();
					provincia.setId(rs.getInt("KYC_DIR_PRV"));
					provincia.setName(rs.getString("KYC_DIR_PRD"));
					kycPersFis.setDirProvincia(provincia);
					kycPersFis.setDirLocalidad(rs.getString("KYC_DIR_LOC"));
					kycPersFis.setDirCodigoPostal(rs.getString("KYC_DIR_CPO"));
					kycPersFis.setTelefono(rs.getString("KYC_DIR_TEL"));
					kycPersFis.setEmail(rs.getString("KYC_DIR_EMA"));
					kycPersFis.setTieneRep(rs.getBoolean("KYC_TIE_REP"));
					List<Representante> representanteList = new ArrayList<Representante>();
					representanteList = getKYCRepList(rs.getLong("KYC_NUM_CUI"));
					kycPersFis.setRepresentanteList(representanteList);
					kycPersFis.setEsTitMPago(rs.getBoolean("KYC_TIT_MPG"));
					List<TitularMedioPago> titMPagoList = new ArrayList<TitularMedioPago>();
					titMPagoList = getKYCTitMPgList(rs.getLong("KYC_NUM_CUI"));
					kycPersFis.setTitMPagoList(titMPagoList);
					// Panel 2
					Actividad actividad = new Actividad();
					actividad.setId(rs.getInt("KYC_COD_ACT"));
					actividad.setName(rs.getString("KYC_NOM_ACT"));
					kycPersFis.setActividad(actividad);
					kycPersFis.setActividadDes(rs.getString("KYC_DES_ACT"));
					kycPersFis.setPropositoDes(rs.getString("KYC_DES_PRO"));
					kycPersFis.setEsSCC(rs.getBoolean("KYC_CES_SCC"));
					kycPersFis.setMotivoSCC(rs.getString("KYC_MOT_SCC"));
					kycPersFis.setEsPEP(rs.getBoolean("KYC_CES_PEP"));
					kycPersFis.setTieneRepSCC(rs.getBoolean("KYC_TIE_SCC"));
					kycPersFis.setEsClienteBco(rs.getBoolean("KYC_CES_CLI"));
					CondicionIVA condicionIVA = new CondicionIVA();
					condicionIVA.setId(rs.getInt("KYC_COD_CIV"));
					condicionIVA.setName(rs.getString("KYC_NOM_CIV"));
					kycPersFis.setCondicionIVA(condicionIVA);
					kycPersFis.setCondicionLab(rs.getBoolean("KYC_REG_ORG") ? "R" : "A");
					kycPersFis.setCategoriaMono(rs.getString("KYC_COD_CTM"));
					kycPersFis.setIngFecha(rs.getInt("KYC_ING_FEC"));
					kycPersFis.setIngSalMen(rs.getDouble("KYC_ING_004"));
					kycPersFis.setIngSalario(rs.getDouble("KYC_ING_001"));
					kycPersFis.setIngGanancia(rs.getDouble("KYC_ING_002"));
					kycPersFis.setIngOtros(rs.getDouble("KYC_ING_003"));
					kycPersFis.setIngTotal(rs.getDouble("KYC_ING_005"));
					kycPersFis.setDocResDetalle(rs.getString("KYC_DRE_DET"));
					kycPersFis.setTieneRelHSBC(rs.getBoolean("KYC_TIE_REL"));
					kycPersFis.setRelDetalle(rs.getString("KYC_DET_REL"));
					kycPersFis.setInicioAnn(rs.getInt("KYC_INI_ANN"));
					// Panel 3
					kycPersFis.setValorOperar(rs.getDouble("KYC_VAL_OPE"));
					kycPersFis.setPrimaAnual(rs.getDouble("KYC_PRI_ANN"));
					kycPersFis.setValorOperarMot(rs.getString("KYC_VAL_MOT"));
					kycPersFis.setPerfilComentarios(rs.getString("KYC_PFL_COM"));
					kycPersFis.setUltFecha(rs.getInt("KYC_ULT_FEC"));
					// Panel 4
					List<OperacionInusual> opeInusualList = new ArrayList<OperacionInusual>();
					opeInusualList = getKYCOInList(rs.getLong("KYC_NUM_CUI"));
					kycPersFis.setOpeInusualList(opeInusualList);

					// Devolver Datos
					return kycPersFis;
				};
			}));
			compile();
		}

		public P_KS_OPE_KYCDATOS_SEL(final DataSource dataSource, final KYCPersJur kycPersJurPar) {
			super(dataSource, P_KS_OPE_KYCDATOS_SEL.SPROC_NAME);
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_SEL.PARAM_NUM_CUI, Types.NUMERIC));

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					KYCPersJur kycPersJur = new KYCPersJur();
					// Generales
					EstadoKYC estadoKYC = new EstadoKYC();
					estadoKYC.setCodigo(rs.getString("KYC_COD_EST"));
					estadoKYC.setDescripcion(rs.getString("KYC_DES_EST"));
					kycPersJur.setEstadoKYC(estadoKYC);
					// Panel 1
					kycPersJur.setNumeroCUIT(rs.getLong("KYC_NUM_CUI"));
					kycPersJur.setRazonSocial(rs.getString("KYC_APE_CLI") + rs.getString("KYC_NOM_CLI"));
					kycPersJur.setFechaConstitucion(rs.getInt("KYC_FEC_CON"));
					kycPersJur.setDirCalle(rs.getString("KYC_DIR_CAL"));
					kycPersJur.setDirNumero(rs.getString("KYC_DIR_NUM"));
					kycPersJur.setDirPiso(rs.getString("KYC_DIR_PIS"));
					kycPersJur.setDirDepto(rs.getString("KYC_DIR_DTO"));
					Provincia provincia = new Provincia();
					provincia.setId(rs.getInt("KYC_DIR_PRV"));
					provincia.setName(rs.getString("KYC_DIR_PRD"));
					kycPersJur.setDirProvincia(provincia);
					kycPersJur.setDirLocalidad(rs.getString("KYC_DIR_LOC"));
					kycPersJur.setDirCodigoPostal(rs.getString("KYC_DIR_CPO"));
					kycPersJur.setTelefono(rs.getString("KYC_DIR_TEL"));
					kycPersJur.setEmail(rs.getString("KYC_DIR_EMA"));
					List<Representante> representanteList = new ArrayList<Representante>();
					representanteList = getKYCRepList(rs.getLong("KYC_NUM_CUI"));
					kycPersJur.setRepresentanteList(representanteList);
					kycPersJur.setEsTitMPago(rs.getBoolean("KYC_TIT_MPG"));
					List<TitularMedioPago> titMPagoList = new ArrayList<TitularMedioPago>();
					titMPagoList = getKYCTitMPgList(rs.getLong("KYC_NUM_CUI"));
					kycPersJur.setTitMPagoList(titMPagoList);
					// Panel 2
					Actividad actividad = new Actividad();
					actividad.setId(rs.getInt("KYC_COD_ACT"));
					actividad.setName(rs.getString("KYC_NOM_ACT"));
					kycPersJur.setActividad(actividad);
					kycPersJur.setActividadDes(rs.getString("KYC_DES_ACT"));
					kycPersJur.setPropositoDes(rs.getString("KYC_DES_PRO"));
					Caracter caracter = new Caracter();
					caracter.setId(rs.getInt("KYC_COD_CAR"));
					caracter.setName(rs.getString("KYC_NOM_CAR"));
					kycPersJur.setCaracter(caracter);
					kycPersJur.setCaracterDes(rs.getString("KYC_DES_CAR"));
					kycPersJur.setEsClienteBco(rs.getBoolean("KYC_CES_CLI"));
					kycPersJur.setCotizaBolsa(rs.getBoolean("KYC_COT_BOL"));
					kycPersJur.setSubsCiaCotizaBolsa(rs.getBoolean("KYC_SUB_CIA"));
					kycPersJur.setCliRegOrganismo(rs.getBoolean("KYC_REG_ORG"));
					kycPersJur.setEsSCC(rs.getBoolean("KYC_CES_SCC"));
					kycPersJur.setMotivoSCC(rs.getString("KYC_MOT_SCC"));
					kycPersJur.setTieneRepSCC(rs.getBoolean("KYC_TIE_SCC"));
					kycPersJur.setAccionistas(rs.getString("KYC_ACC_DET"));
					List<Compania> companiaList = new ArrayList<Compania>();
					companiaList = getKYCCiaList(rs.getLong("KYC_NUM_CUI"));
					kycPersJur.setCompaniaList(companiaList);
					kycPersJur.setTieneRelHSBC(rs.getBoolean("KYC_TIE_REL"));
					kycPersJur.setRelDetalle(rs.getString("KYC_DET_REL"));
					kycPersJur.setInicioAnn(rs.getInt("KYC_INI_ANN"));
					kycPersJur.setBalAuditor(rs.getString("KYC_DES_AUD"));
					kycPersJur.setBalFecha(rs.getInt("KYC_ING_FEC"));
					kycPersJur.setBalActivo(rs.getDouble("KYC_ING_001"));
					kycPersJur.setBalPasivo(rs.getDouble("KYC_ING_002"));
					kycPersJur.setBalPatNeto(rs.getDouble("KYC_ING_003"));
					kycPersJur.setBalVentas(rs.getDouble("KYC_ING_004"));
					kycPersJur.setBalResFinal(rs.getDouble("KYC_ING_005"));
					kycPersJur.setBalFechaEstContable(rs.getInt("KYC_FEC_ECO"));
					kycPersJur.setDocResDetalle(rs.getString("KYC_DRE_DET"));
					kycPersJur.setObservaciones(rs.getString("KYC_OBS_DET"));
					// Panel 3
					kycPersJur.setValorOperar(rs.getDouble("KYC_VAL_OPE"));
					kycPersJur.setPrimaAnual(rs.getDouble("KYC_PRI_ANN"));
					kycPersJur.setValorOperarMot(rs.getString("KYC_VAL_MOT"));
					kycPersJur.setPerfilComentarios(rs.getString("KYC_PFL_COM"));
					kycPersJur.setUltFecha(rs.getInt("KYC_ULT_FEC"));
					// Panel 4
					List<OperacionInusual> opeInusualList = new ArrayList<OperacionInusual>();
					opeInusualList = getKYCOInList(rs.getLong("KYC_NUM_CUI"));
					kycPersJur.setOpeInusualList(opeInusualList);

					// Devolver Datos
					return kycPersJur;
				};
			}));
			compile();
		}

		public Map execute(final Long numeroCUIL) {
			Map inputs = new HashMap();
			inputs.put(P_KS_OPE_KYCDATOS_SEL.PARAM_NUM_CUI, new Long(numeroCUIL));
			return super.execute(inputs);
		}
	}

	public Boolean setKYCPersFis(final KYCPersFis kycPersFis, final AuthorizedUser operador) {
		try {
			// Borrar el anterior (Completo)
			delKYCPersFis(kycPersFis.getNumeroCUIL());
			// Insertar el nuevo
			P_KS_OPE_KYCDATOS_INS spIns = new P_KS_OPE_KYCDATOS_INS(this.dataSource);
			spIns.execute(kycPersFis, operador);
			// Insertar los Representantes
			if (kycPersFis.getTieneRep()) {
				P_KS_OPE_KYCREP_INS spInsRep = new P_KS_OPE_KYCREP_INS(this.dataSource);

				for (int i = 0; i < kycPersFis.getRepresentanteList().size(); i++) {
					spInsRep.execute(kycPersFis.getNumeroCUIL(), kycPersFis.getRepresentanteList().get(i));
				}
			}
			// Insertar los Titulares de medios de pago
			if (!kycPersFis.getEsTitMPago()) {
				P_KS_OPE_KYCTITMPG_INS spInsTMP = new P_KS_OPE_KYCTITMPG_INS(this.dataSource);

				for (int i = 0; i < kycPersFis.getTitMPagoList().size(); i++) {
					spInsTMP.execute(kycPersFis.getNumeroCUIL(), kycPersFis.getTitMPagoList().get(i));
				}
			}
			// Insertar las Operaciones Inusuales
			if (kycPersFis.getOpeInusualList().size() > 0) {
				P_KS_OPE_KYCOPEINU_INS spInsOIn = new P_KS_OPE_KYCOPEINU_INS(this.dataSource);

				for (int i = 0; i < kycPersFis.getOpeInusualList().size(); i++) {
					spInsOIn.execute(kycPersFis.getNumeroCUIL(), kycPersFis.getOpeInusualList().get(i));
				}
			}
			return true;
		} catch (Exception e) {
			KYCDaoImpl.logger.error(e);
			return false;
		}
	}

	public Boolean setKYCPersJur(final KYCPersJur kycPersJur, final AuthorizedUser operador) {
		try {
			// Borrar el anterior (Completo)
			delKYCPersFis(kycPersJur.getNumeroCUIT());
			// Insertar el nuevo
			P_KS_OPE_KYCDATOS_INS spIns = new P_KS_OPE_KYCDATOS_INS(this.dataSource);
			spIns.execute(kycPersJur, operador);
			// Insertar los Representantes
			if (kycPersJur.getRepresentanteList().size() > 0) {
				P_KS_OPE_KYCREP_INS spInsRep = new P_KS_OPE_KYCREP_INS(this.dataSource);

				for (int i = 0; i < kycPersJur.getRepresentanteList().size(); i++) {
					spInsRep.execute(kycPersJur.getNumeroCUIT(), kycPersJur.getRepresentanteList().get(i));
				}
			}
			// Insertar los Titulares de medios de pago
			if (!kycPersJur.getEsTitMPago()) {
				P_KS_OPE_KYCTITMPG_INS spInsTMP = new P_KS_OPE_KYCTITMPG_INS(this.dataSource);

				for (int i = 0; i < kycPersJur.getTitMPagoList().size(); i++) {
					spInsTMP.execute(kycPersJur.getNumeroCUIT(), kycPersJur.getTitMPagoList().get(i));
				}
			}
			// Insertar las Companias
			if (kycPersJur.getCompaniaList().size() > 0) {
				P_KS_OPE_KYCCIA_INS spInsCia = new P_KS_OPE_KYCCIA_INS(this.dataSource);

				for (int i = 0; i < kycPersJur.getCompaniaList().size(); i++) {
					spInsCia.execute(kycPersJur.getNumeroCUIT(), kycPersJur.getCompaniaList().get(i));
				}
			}
			// Insertar las Operaciones Inusuales
			if (kycPersJur.getOpeInusualList().size() > 0) {
				P_KS_OPE_KYCOPEINU_INS spInsOIn = new P_KS_OPE_KYCOPEINU_INS(this.dataSource);

				for (int i = 0; i < kycPersJur.getOpeInusualList().size(); i++) {
					spInsOIn.execute(kycPersJur.getNumeroCUIT(), kycPersJur.getOpeInusualList().get(i));
				}
			}
		} catch (Exception e) {
			KYCDaoImpl.logger.error(e);
			return false;
		}

		return true;
	}

	public class P_KS_OPE_KYCDATOS_INS extends StoredProcedure {
		private static final String SPROC_NAME = "P_KS_OPE_KYCDATOS_INS";
		private static final String PARAM_NUM_CUI = "NUM_CUI";
		private static final String PARAM_NUM_TDO = "NUM_TDO";
		private static final String PARAM_DES_TDO = "DES_TDO";
		private static final String PARAM_NUM_DOC = "NUM_DOC";
		private static final String PARAM_APE_CLI = "APE_CLI";
		private static final String PARAM_NOM_CLI = "NOM_CLI";
		private static final String PARAM_COD_NAC = "COD_NAC";
		private static final String PARAM_FEC_CON = "FEC_CON";
		private static final String PARAM_DIR_CAL = "DIR_CAL";
		private static final String PARAM_DIR_NUM = "DIR_NUM";
		private static final String PARAM_DIR_PIS = "DIR_PIS";
		private static final String PARAM_DIR_DTO = "DIR_DTO";
		private static final String PARAM_DIR_PRV = "DIR_PRV";
		private static final String PARAM_DIR_LOC = "DIR_LOC";
		private static final String PARAM_DIR_CPO = "DIR_CPO";
		private static final String PARAM_DIR_TEL = "DIR_TEL";
		private static final String PARAM_DIR_EMA = "DIR_EMA";
		private static final String PARAM_TIE_REP = "TIE_REP";
		private static final String PARAM_TIT_MPG = "TIT_MPG";
		private static final String PARAM_COD_ACT = "COD_ACT";
		private static final String PARAM_NOM_ACT = "NOM_ACT";
		private static final String PARAM_DES_ACT = "DES_ACT";
		private static final String PARAM_DES_PRO = "DES_PRO";
		private static final String PARAM_COD_CAR = "COD_CAR";
		private static final String PARAM_DES_CAR = "DES_CAR";
		private static final String PARAM_REG_ORG = "REG_ORG";
		private static final String PARAM_CES_SCC = "CES_SCC";
		private static final String PARAM_MOT_SCC = "MOT_SCC";
		private static final String PARAM_CES_PEP = "CES_PEP";
		private static final String PARAM_TIE_SCC = "TIE_SCC";
		private static final String PARAM_CES_CLI = "CES_CLI";
		private static final String PARAM_COT_BOL = "COT_BOL";
		private static final String PARAM_SUB_CIA = "SUB_CIA";
		private static final String PARAM_ACC_DET = "ACC_DET";
		private static final String PARAM_COD_CIV = "COD_CIV";
		private static final String PARAM_COD_CTM = "COD_CTM";
		private static final String PARAM_ING_FEC = "ING_FEC";
		private static final String PARAM_ING_001 = "ING_001";
		private static final String PARAM_ING_002 = "ING_002";
		private static final String PARAM_ING_003 = "ING_003";
		private static final String PARAM_ING_004 = "ING_004";
		private static final String PARAM_ING_005 = "ING_005";
		private static final String PARAM_FEC_ECO = "FEC_ECO";
		private static final String PARAM_DES_AUD = "DES_AUD";
		private static final String PARAM_DRE_DET = "DRE_DET";
		private static final String PARAM_OBS_DET = "OBS_DET";
		private static final String PARAM_TIE_REL = "TIE_REL";
		private static final String PARAM_DET_REL = "DET_REL";
		private static final String PARAM_INI_ANN = "INI_ANN";
		private static final String PARAM_VAL_OPE = "VAL_OPE";
		private static final String PARAM_PRI_ANN = "PRI_ANN";
		private static final String PARAM_VAL_MOT = "VAL_MOT";
		private static final String PARAM_PFL_COM = "PFL_COM";
		private static final String PARAM_ULT_FEC = "ULT_FEC";
		private static final String PARAM_NOP_PPS = "NOP_PPS";
		private static final String PARAM_NOP_APE = "NOP_APE";
		private static final String PARAM_NOP_NOM = "NOP_NOM";

		public P_KS_OPE_KYCDATOS_INS(final DataSource dataSource) {
			super(dataSource, P_KS_OPE_KYCDATOS_INS.SPROC_NAME);
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_NUM_CUI, Types.NUMERIC));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_NUM_TDO, Types.SMALLINT));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_DES_TDO, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_NUM_DOC, Types.NUMERIC));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_APE_CLI, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_NOM_CLI, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_COD_NAC, Types.SMALLINT));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_FEC_CON, Types.INTEGER));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_CAL, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_NUM, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_PIS, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_DTO, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_PRV, Types.NUMERIC));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_LOC, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_CPO, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_TEL, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_EMA, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_TIE_REP, Types.BIT));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_TIT_MPG, Types.BIT));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_COD_ACT, Types.NUMERIC));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_NOM_ACT, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_DES_ACT, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_DES_PRO, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_COD_CAR, Types.SMALLINT));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_DES_CAR, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_REG_ORG, Types.BIT));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_CES_SCC, Types.BIT));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_MOT_SCC, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_CES_PEP, Types.BIT));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_TIE_SCC, Types.BIT));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_CES_CLI, Types.BIT));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_COT_BOL, Types.BIT));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_SUB_CIA, Types.BIT));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_ACC_DET, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_COD_CIV, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_COD_CTM, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_ING_FEC, Types.INTEGER));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_ING_001, Types.DOUBLE)); // DECIMAL
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_ING_002, Types.DOUBLE)); // DECIMAL
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_ING_003, Types.DOUBLE)); // DECIMAL
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_ING_004, Types.DOUBLE)); // DECIMAL
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_ING_005, Types.DOUBLE)); // DECIMAL
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_FEC_ECO, Types.INTEGER));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_DES_AUD, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_DRE_DET, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_OBS_DET, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_TIE_REL, Types.BIT));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_DET_REL, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_INI_ANN, Types.SMALLINT));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_VAL_OPE, Types.DOUBLE)); // DECIMAL
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_PRI_ANN, Types.DOUBLE)); // DECIMAL
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_VAL_MOT, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_PFL_COM, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_ULT_FEC, Types.INTEGER));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_NOP_PPS, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_NOP_APE, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_NOP_NOM, Types.VARCHAR));
			compile();
		}

		public void execute(final KYCPersFis kycPersFis, final AuthorizedUser operador) {
			Map inputs = new HashMap();
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_NUM_CUI, new Long(kycPersFis.getNumeroCUIL()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_NUM_TDO, new Integer(kycPersFis.getTipoDoc().getId()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DES_TDO, new String(kycPersFis.getTipoDoc().getName()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_NUM_DOC, new Long(kycPersFis.getNumeroDoc()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_APE_CLI, new String(kycPersFis.getApellido()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_NOM_CLI, new String(kycPersFis.getNombre()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_COD_NAC, new Integer(kycPersFis.getNacionalidad().getId()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_FEC_CON, new Integer(kycPersFis.getFechaNacimiento())); // PPCR_2015-00142_(ENS)
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_CAL, new String(kycPersFis.getDirCalle()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_NUM, new String(kycPersFis.getDirNumero()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_PIS, new String(kycPersFis.getDirPiso()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_DTO, new String(kycPersFis.getDirDepto()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_PRV, new Integer(kycPersFis.getDirProvincia().getId()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_LOC, new String(kycPersFis.getDirLocalidad()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_CPO, new String(kycPersFis.getDirCodigoPostal()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_TEL, new String(kycPersFis.getTelefono()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_EMA, new String(kycPersFis.getEmail()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_TIE_REP, new Boolean(kycPersFis.getTieneRep()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_TIT_MPG, new Boolean(kycPersFis.getEsTitMPago()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_COD_ACT, new Integer(kycPersFis.getActividad().getId()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_NOM_ACT, new String(kycPersFis.getActividad().getName()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DES_ACT, new String(kycPersFis.getActividadDes()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DES_PRO, new String(kycPersFis.getPropositoDes()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_COD_CAR, new Integer(0));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DES_CAR, new String(""));
			// Aca va la condicion laboral (true-si es RD false-si es A)
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_REG_ORG, new Boolean(
					kycPersFis.getCondicionLab().equalsIgnoreCase("R") ? true : false));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_CES_SCC, new Boolean(kycPersFis.getEsSCC()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_MOT_SCC, new String(kycPersFis.getMotivoSCC()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_CES_PEP, new Boolean(kycPersFis.getEsPEP()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_TIE_SCC, new Boolean(kycPersFis.getTieneRepSCC()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_CES_CLI, new Boolean(kycPersFis.getEsClienteBco()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_COT_BOL, new Boolean(false));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_SUB_CIA, new Boolean(false));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_ACC_DET, new String(""));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_COD_CIV, new Integer(kycPersFis.getCondicionIVA().getId()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_COD_CTM, new String(kycPersFis.getCategoriaMono()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_ING_FEC, new Integer(kycPersFis.getIngFecha()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_ING_001, new Double(kycPersFis.getIngSalario()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_ING_002, new Double(kycPersFis.getIngGanancia()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_ING_003, new Double(kycPersFis.getIngOtros()));
			// Aca va el ingreso mensual
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_ING_004, new Double(kycPersFis.getIngSalMen()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_ING_005, new Double(kycPersFis.getIngTotal()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_FEC_ECO, new Integer(0));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DES_AUD, new String(""));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DRE_DET, new String(kycPersFis.getDocResDetalle()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_OBS_DET, new String(""));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_TIE_REL, new Boolean(kycPersFis.getTieneRelHSBC()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DET_REL, new String(kycPersFis.getRelDetalle()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_INI_ANN, new Integer(kycPersFis.getInicioAnn()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_VAL_OPE, new Double(kycPersFis.getValorOperar()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_PRI_ANN, new Double(kycPersFis.getPrimaAnual()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_VAL_MOT, new String(kycPersFis.getValorOperarMot()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_PFL_COM, new String(kycPersFis.getPerfilComentarios()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_ULT_FEC, new Integer(kycPersFis.getUltFecha()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_NOP_PPS, new String(operador.getPeopleSoft()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_NOP_APE, new String(operador.getlName()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_NOP_NOM, new String(operador.getfName()));
			super.execute(inputs);
		}

		public void execute(final KYCPersJur kycPersJur, final AuthorizedUser operador) {
			Map inputs = new HashMap();
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_NUM_CUI, new Long(kycPersJur.getNumeroCUIT()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_NUM_TDO, new Integer(0));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DES_TDO, new String(""));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_NUM_DOC, new Long(0));
			if (kycPersJur.getRazonSocial().length() > 40) {
				inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_APE_CLI, new String(kycPersJur.getRazonSocial().substring(0, 40)));
				inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_NOM_CLI,
						new String(kycPersJur.getRazonSocial().substring(40, kycPersJur.getRazonSocial().length())));
			} else {
				inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_APE_CLI, new String(kycPersJur.getRazonSocial()));
				inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_NOM_CLI, new String(""));
			}
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_COD_NAC, new Integer(0));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_FEC_CON, new Integer(kycPersJur.getFechaConstitucion()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_CAL, new String(kycPersJur.getDirCalle()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_NUM, new String(kycPersJur.getDirNumero()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_PIS, new String(kycPersJur.getDirPiso()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_DTO, new String(kycPersJur.getDirDepto()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_PRV, new Integer(kycPersJur.getDirProvincia().getId()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_LOC, new String(kycPersJur.getDirLocalidad()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_CPO, new String(kycPersJur.getDirCodigoPostal()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_TEL, new String(kycPersJur.getTelefono()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DIR_EMA, new String(kycPersJur.getEmail()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_TIE_REP, new Boolean(true));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_TIT_MPG, new Boolean(kycPersJur.getEsTitMPago()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_COD_ACT, new Integer(kycPersJur.getActividad().getId()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_NOM_ACT, new String(kycPersJur.getActividad().getName()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DES_ACT, new String(kycPersJur.getActividadDes()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DES_PRO, new String(kycPersJur.getPropositoDes()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_COD_CAR, new Integer(kycPersJur.getCaracter().getId()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DES_CAR, new String(kycPersJur.getCaracterDes()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_REG_ORG, new Boolean(kycPersJur.getCliRegOrganismo()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_CES_SCC, new Boolean(kycPersJur.getEsSCC()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_MOT_SCC, new String(kycPersJur.getMotivoSCC()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_CES_PEP, new Boolean(false));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_TIE_SCC, new Boolean(kycPersJur.getTieneRepSCC()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_CES_CLI, new Boolean(kycPersJur.getEsClienteBco()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_COT_BOL, new Boolean(kycPersJur.getCotizaBolsa()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_SUB_CIA, new Boolean(kycPersJur.getSubsCiaCotizaBolsa()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_ACC_DET, new String(kycPersJur.getAccionistas()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_COD_CIV, new Integer(0));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_COD_CTM, new String(""));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_ING_FEC, new Integer(kycPersJur.getBalFecha()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_ING_001, new Double(kycPersJur.getBalActivo()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_ING_002, new Double(kycPersJur.getBalPasivo()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_ING_003, new Double(kycPersJur.getBalPatNeto()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_ING_004, new Double(kycPersJur.getBalVentas()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_ING_005, new Double(kycPersJur.getBalResFinal()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_FEC_ECO, new Integer(kycPersJur.getBalFechaEstContable()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DES_AUD, new String(kycPersJur.getBalAuditor()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DRE_DET, new String(kycPersJur.getDocResDetalle()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_OBS_DET, new String(kycPersJur.getObservaciones()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_TIE_REL, new Boolean(kycPersJur.getTieneRelHSBC()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_DET_REL, new String(kycPersJur.getRelDetalle()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_INI_ANN, new Integer(kycPersJur.getInicioAnn()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_VAL_OPE, new Double(kycPersJur.getValorOperar()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_PRI_ANN, new Double(kycPersJur.getPrimaAnual()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_VAL_MOT, new String(kycPersJur.getValorOperarMot()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_PFL_COM, new String(kycPersJur.getPerfilComentarios()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_ULT_FEC, new Integer(kycPersJur.getUltFecha()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_NOP_PPS, new String(operador.getPeopleSoft()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_NOP_APE, new String(operador.getlName()));
			inputs.put(P_KS_OPE_KYCDATOS_INS.PARAM_NOP_NOM, new String(operador.getfName()));
			super.execute(inputs);
		}
	}

	public void delKYCPersFis(final Long numeroCUIL) {
		P_KS_OPE_KYCDATOS_DEL spDel = new P_KS_OPE_KYCDATOS_DEL(this.dataSource);
		spDel.execute(numeroCUIL);
	}

	public void delKYCPersJur(final Long numeroCUIT) {
		P_KS_OPE_KYCDATOS_DEL spDel = new P_KS_OPE_KYCDATOS_DEL(this.dataSource);
		spDel.execute(numeroCUIT);
	}

	public class P_KS_OPE_KYCDATOS_DEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_KS_OPE_KYCDATOS_DEL";
		private static final String PARAM_NUM_CUI = "NUM_CUI";

		public P_KS_OPE_KYCDATOS_DEL(final DataSource dataSource) {
			super(dataSource, P_KS_OPE_KYCDATOS_DEL.SPROC_NAME);
			declareParameter(new SqlParameter(P_KS_OPE_KYCDATOS_INS.PARAM_NUM_CUI, Types.NUMERIC));
			compile();
		}

		public void execute(final Long numeroCUIL) {
			Map inputs = new HashMap();
			inputs.put(P_KS_OPE_KYCDATOS_DEL.PARAM_NUM_CUI, new Long(numeroCUIL));
			super.execute(inputs);
		}
	}

	public class P_KS_OPE_KYCREP_INS extends StoredProcedure {
		private static final String SPROC_NAME = "P_KS_OPE_KYCREP_INS";
		private static final String PARAM_NUM_CUI = "NUM_CUI";
		private static final String PARAM_TIP_DOC = "TIP_DOC";
		private static final String PARAM_NUM_DOC = "NUM_DOC";
		private static final String PARAM_APE_REP = "APE_REP";
		private static final String PARAM_NOM_REP = "NOM_REP";
		private static final String PARAM_SCC_REP = "SCC_REP";
		private static final String PARAM_CRG_REP = "CRG_REP";
		private static final String PARAM_PEP_REP = "PEP_REP";
		private static final String PARAM_FEC_CON = "FEC_CON";

		public P_KS_OPE_KYCREP_INS(final DataSource dataSource) {
			super(dataSource, P_KS_OPE_KYCREP_INS.SPROC_NAME);
			declareParameter(new SqlParameter(P_KS_OPE_KYCREP_INS.PARAM_NUM_CUI, Types.NUMERIC));
			declareParameter(new SqlParameter(P_KS_OPE_KYCREP_INS.PARAM_TIP_DOC, Types.SMALLINT));
			declareParameter(new SqlParameter(P_KS_OPE_KYCREP_INS.PARAM_NUM_DOC, Types.NUMERIC));
			declareParameter(new SqlParameter(P_KS_OPE_KYCREP_INS.PARAM_APE_REP, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCREP_INS.PARAM_NOM_REP, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCREP_INS.PARAM_SCC_REP, Types.BIT));
			declareParameter(new SqlParameter(P_KS_OPE_KYCREP_INS.PARAM_CRG_REP, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCREP_INS.PARAM_PEP_REP, Types.BIT));
			declareParameter(new SqlParameter(P_KS_OPE_KYCREP_INS.PARAM_FEC_CON, Types.INTEGER));
			compile();
		}

		public void execute(final Long numeroCUIL, final Representante representante) {
			Map inputs = new HashMap();
			inputs.put(P_KS_OPE_KYCREP_INS.PARAM_NUM_CUI, new Long(numeroCUIL));
			inputs.put(P_KS_OPE_KYCREP_INS.PARAM_TIP_DOC, new Integer(representante.getTipoDoc().getId()));
			inputs.put(P_KS_OPE_KYCREP_INS.PARAM_NUM_DOC, new Long(representante.getNumeroDoc()));
			inputs.put(P_KS_OPE_KYCREP_INS.PARAM_APE_REP, new String(representante.getApellido()));
			inputs.put(P_KS_OPE_KYCREP_INS.PARAM_NOM_REP, new String(representante.getNombre()));
			inputs.put(P_KS_OPE_KYCREP_INS.PARAM_SCC_REP, new Boolean(representante.getEsSCC()));
			inputs.put(P_KS_OPE_KYCREP_INS.PARAM_CRG_REP, new String(representante.getCargo()));
			inputs.put(P_KS_OPE_KYCREP_INS.PARAM_PEP_REP, new Boolean(representante.getEsPEP()));
			inputs.put(P_KS_OPE_KYCREP_INS.PARAM_FEC_CON, new Integer(representante.getFechaConstitNacim()));
			super.execute(inputs);
		}
	}

	public class P_KS_OPE_KYCTITMPG_INS extends StoredProcedure {
		private static final String SPROC_NAME = "P_KS_OPE_KYCTITMPG_INS";
		private static final String PARAM_NUM_CUI = "NUM_CUI";
		private static final String PARAM_TIP_DOC = "TIP_DOC";
		private static final String PARAM_NUM_DOC = "NUM_DOC";
		private static final String PARAM_APE_TMP = "APE_REP";
		private static final String PARAM_NOM_TMP = "NOM_REP";
		private static final String PARAM_MED_PAG = "MED_PAG";

		public P_KS_OPE_KYCTITMPG_INS(final DataSource dataSource) {
			super(dataSource, P_KS_OPE_KYCTITMPG_INS.SPROC_NAME);
			declareParameter(new SqlParameter(P_KS_OPE_KYCTITMPG_INS.PARAM_NUM_CUI, Types.NUMERIC));
			declareParameter(new SqlParameter(P_KS_OPE_KYCTITMPG_INS.PARAM_TIP_DOC, Types.SMALLINT));
			declareParameter(new SqlParameter(P_KS_OPE_KYCTITMPG_INS.PARAM_NUM_DOC, Types.NUMERIC));
			declareParameter(new SqlParameter(P_KS_OPE_KYCTITMPG_INS.PARAM_APE_TMP, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCTITMPG_INS.PARAM_NOM_TMP, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCTITMPG_INS.PARAM_MED_PAG, Types.VARCHAR));
			compile();
		}

		public void execute(final Long numeroCUIL, final TitularMedioPago titularMedioPago) {
			Map inputs = new HashMap();
			inputs.put(P_KS_OPE_KYCTITMPG_INS.PARAM_NUM_CUI, new Long(numeroCUIL));
			inputs.put(P_KS_OPE_KYCTITMPG_INS.PARAM_TIP_DOC, new Integer(titularMedioPago.getTipoDoc().getId()));
			inputs.put(P_KS_OPE_KYCTITMPG_INS.PARAM_NUM_DOC, new Long(titularMedioPago.getNumeroDoc()));
			inputs.put(P_KS_OPE_KYCTITMPG_INS.PARAM_APE_TMP, new String(titularMedioPago.getApellido()));
			inputs.put(P_KS_OPE_KYCTITMPG_INS.PARAM_NOM_TMP, new String(titularMedioPago.getNombre()));
			inputs.put(P_KS_OPE_KYCTITMPG_INS.PARAM_MED_PAG, new String(titularMedioPago.getMedioPago()));
			super.execute(inputs);
		}
	}

	public class P_KS_OPE_KYCOPEINU_INS extends StoredProcedure {
		private static final String SPROC_NAME = "P_KS_OPE_KYCOPEINU_INS";
		private static final String PARAM_NUM_CUI = "NUM_CUI";
		private static final String PARAM_NUM_SEC = "NUM_SEC";
		private static final String PARAM_FEC_OIN = "FEC_OIN";
		private static final String PARAM_TIP_OPE = "TIP_OPE";
		private static final String PARAM_ORI_FON = "ORI_FON";
		private static final String PARAM_MON_OIN = "MON_OIN";
		private static final String PARAM_OBS_OIN = "OBS_OIN";

		public P_KS_OPE_KYCOPEINU_INS(final DataSource dataSource) {
			super(dataSource, P_KS_OPE_KYCOPEINU_INS.SPROC_NAME);
			declareParameter(new SqlParameter(P_KS_OPE_KYCOPEINU_INS.PARAM_NUM_CUI, Types.NUMERIC));
			declareParameter(new SqlParameter(P_KS_OPE_KYCOPEINU_INS.PARAM_NUM_SEC, Types.SMALLINT));
			declareParameter(new SqlParameter(P_KS_OPE_KYCOPEINU_INS.PARAM_FEC_OIN, Types.INTEGER));
			declareParameter(new SqlParameter(P_KS_OPE_KYCOPEINU_INS.PARAM_TIP_OPE, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCOPEINU_INS.PARAM_ORI_FON, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCOPEINU_INS.PARAM_MON_OIN, Types.DOUBLE)); // DECIMAL
			declareParameter(new SqlParameter(P_KS_OPE_KYCOPEINU_INS.PARAM_OBS_OIN, Types.VARCHAR));
			compile();
		}

		public void execute(final Long numeroCUIL, final OperacionInusual operacionInusual) {
			Map inputs = new HashMap();
			inputs.put(P_KS_OPE_KYCOPEINU_INS.PARAM_NUM_CUI, new Long(numeroCUIL));
			inputs.put(P_KS_OPE_KYCOPEINU_INS.PARAM_NUM_SEC, new Integer(operacionInusual.getSecuencia()));
			inputs.put(P_KS_OPE_KYCOPEINU_INS.PARAM_FEC_OIN, new Integer(operacionInusual.getFecha()));
			inputs.put(P_KS_OPE_KYCOPEINU_INS.PARAM_TIP_OPE, new String(operacionInusual.getTipoOperacion()));
			inputs.put(P_KS_OPE_KYCOPEINU_INS.PARAM_ORI_FON, new String(operacionInusual.getOrigenFondos()));
			inputs.put(P_KS_OPE_KYCOPEINU_INS.PARAM_MON_OIN, new Double(operacionInusual.getMonto()));
			inputs.put(P_KS_OPE_KYCOPEINU_INS.PARAM_OBS_OIN, new String(operacionInusual.getObservacion()));
			super.execute(inputs);
		}
	}

	public class P_KS_OPE_KYCCIA_INS extends StoredProcedure {
		private static final String SPROC_NAME = "P_KS_OPE_KYCCIA_INS";
		private static final String PARAM_NUM_CUI = "NUM_CUI";
		private static final String PARAM_NUM_SEC = "NUM_SEC";
		private static final String PARAM_RAZ_SOC = "RAZ_SOC";
		private static final String PARAM_SCC_CIA = "SCC_CIA";
		private static final String PARAM_FEC_CON = "FEC_CON";

		public P_KS_OPE_KYCCIA_INS(final DataSource dataSource) {
			super(dataSource, P_KS_OPE_KYCCIA_INS.SPROC_NAME);
			declareParameter(new SqlParameter(P_KS_OPE_KYCCIA_INS.PARAM_NUM_CUI, Types.NUMERIC));
			declareParameter(new SqlParameter(P_KS_OPE_KYCCIA_INS.PARAM_NUM_SEC, Types.SMALLINT));
			declareParameter(new SqlParameter(P_KS_OPE_KYCCIA_INS.PARAM_RAZ_SOC, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_OPE_KYCCIA_INS.PARAM_SCC_CIA, Types.BIT));
			declareParameter(new SqlParameter(P_KS_OPE_KYCCIA_INS.PARAM_FEC_CON, Types.INTEGER));
			compile();
		}

		public void execute(final Long numeroCUIL, final Compania compania) {
			Map inputs = new HashMap();
			inputs.put(P_KS_OPE_KYCCIA_INS.PARAM_NUM_CUI, new Long(numeroCUIL));
			inputs.put(P_KS_OPE_KYCCIA_INS.PARAM_NUM_SEC, new Integer(compania.getSecuencia()));
			inputs.put(P_KS_OPE_KYCCIA_INS.PARAM_RAZ_SOC, new String(compania.getRazonSocial()));
			inputs.put(P_KS_OPE_KYCCIA_INS.PARAM_SCC_CIA, new Boolean(compania.getEsSCC()));
			inputs.put(P_KS_OPE_KYCREP_INS.PARAM_FEC_CON, new Integer(compania.getFechaConstitucion()));
			super.execute(inputs);
		}
	}
}
