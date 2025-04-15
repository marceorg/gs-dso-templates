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

import com.hsbc.hbar.kycseg.dao.ParametersDao;
import com.hsbc.hbar.kycseg.model.common.Actividad;
import com.hsbc.hbar.kycseg.model.common.AuthorizedUser;
import com.hsbc.hbar.kycseg.model.common.Caracter;
import com.hsbc.hbar.kycseg.model.common.CondicionIVA;
import com.hsbc.hbar.kycseg.model.common.Pais;
import com.hsbc.hbar.kycseg.model.common.Provincia;
import com.hsbc.hbar.kycseg.model.common.TipoDoc;
import com.hsbc.hbar.kycseg.model.kyc.EstadoKYC;

public class ParametersDaoImpl implements ParametersDao {
	static Logger logger = LogManager.getLogger(ParametersDaoImpl.class);

	private DataSource dataSource;

	public void setDataSource(final DataSource datasource) {
		this.dataSource = datasource;
	}

	public DataSource getDataSource() {
		return this.dataSource;
	}

	public List<Provincia> getProvinciaList() {
		try {
			P_KS_PAR_PROVINCIA_SEL sproc = new P_KS_PAR_PROVINCIA_SEL(this.dataSource);
			Map resPro = sproc.execute();
			return (List<Provincia>) resPro.get("Resultado");
		} catch (Exception e) {
			ParametersDaoImpl.logger.error(e);
			return null;
		}
	}

	public class P_KS_PAR_PROVINCIA_SEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_KS_PAR_PROVINCIA_SEL";

		public P_KS_PAR_PROVINCIA_SEL(final DataSource dataSource) {
			super(dataSource, P_KS_PAR_PROVINCIA_SEL.SPROC_NAME);

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					Provincia provincia = new Provincia();
					provincia.setId(rs.getInt("COD_PRV"));
					provincia.setName(rs.getString("DES_PRV"));
					return provincia;
				};
			}));
			compile();
		}

		public Map execute() {
			Map inpPro = new HashMap();
			return super.execute(inpPro);
		}
	}

	public List<TipoDoc> getTipoDocList() {
		try {
			P_KS_PAR_TIPODOC_SEL sproc = new P_KS_PAR_TIPODOC_SEL(this.dataSource);
			Map resTDo = sproc.execute();
			return (List<TipoDoc>) resTDo.get("Resultado");
		} catch (Exception e) {
			ParametersDaoImpl.logger.error(e);
			return null;
		}
	}

	public class P_KS_PAR_TIPODOC_SEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_KS_PAR_TIPODOC_SEL";

		public P_KS_PAR_TIPODOC_SEL(final DataSource dataSource) {
			super(dataSource, P_KS_PAR_TIPODOC_SEL.SPROC_NAME);

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					TipoDoc tipoDoc = new TipoDoc();
					tipoDoc.setId(rs.getInt("COD_TDO"));
					tipoDoc.setName(rs.getString("DES_TDO"));
					return tipoDoc;
				};
			}));
			compile();
		}

		public Map execute() {
			Map inpTDo = new HashMap();
			return super.execute(inpTDo);
		}
	}

	public List<CondicionIVA> getCondicionIVAList() {
		try {
			P_KS_PAR_CONDIVA_SEL sproc = new P_KS_PAR_CONDIVA_SEL(this.dataSource);
			Map resIVA = sproc.execute();
			return (List<CondicionIVA>) resIVA.get("Resultado");
		} catch (Exception e) {
			ParametersDaoImpl.logger.error(e);
			return null;
		}
	}

	public class P_KS_PAR_CONDIVA_SEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_KS_PAR_CONDIVA_SEL";

		public P_KS_PAR_CONDIVA_SEL(final DataSource dataSource) {
			super(dataSource, P_KS_PAR_CONDIVA_SEL.SPROC_NAME);

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					CondicionIVA condicionIVA = new CondicionIVA();
					condicionIVA.setId(rs.getInt("COD_CIV"));
					condicionIVA.setName(rs.getString("DES_CIV"));
					return condicionIVA;
				};
			}));
			compile();
		}

		public Map execute() {
			Map inpIVA = new HashMap();
			return super.execute(inpIVA);
		}
	}

	public List<Caracter> getCaracterList() {
		try {
			P_KS_PAR_CARACTER_SEL sproc = new P_KS_PAR_CARACTER_SEL(this.dataSource);
			Map resCar = sproc.execute();
			return (List<Caracter>) resCar.get("Resultado");
		} catch (Exception e) {
			ParametersDaoImpl.logger.error(e);
			return null;
		}
	}

	public class P_KS_PAR_CARACTER_SEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_KS_PAR_CARACTER_SEL";

		public P_KS_PAR_CARACTER_SEL(final DataSource dataSource) {
			super(dataSource, P_KS_PAR_CARACTER_SEL.SPROC_NAME);

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					Caracter caracter = new Caracter();
					caracter.setId(rs.getInt("COD_CAR"));
					caracter.setName(rs.getString("DES_CAR"));
					return caracter;
				};
			}));
			compile();
		}

		public Map execute() {
			Map inpCar = new HashMap();
			return super.execute(inpCar);
		}
	}

	public List<Pais> getPaisList() {
		try {
			P_KS_PAR_PAIS_SEL sproc = new P_KS_PAR_PAIS_SEL(this.dataSource);
			Map resPai = sproc.execute();
			return (List<Pais>) resPai.get("Resultado");
		} catch (Exception e) {
			ParametersDaoImpl.logger.error(e);
			return null;
		}
	}

	public class P_KS_PAR_PAIS_SEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_KS_PAR_PAIS_SEL";

		public P_KS_PAR_PAIS_SEL(final DataSource dataSource) {
			super(dataSource, P_KS_PAR_PAIS_SEL.SPROC_NAME);

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					Pais pais = new Pais();
					pais.setId(rs.getInt("COD_PAI"));
					pais.setName(rs.getString("DES_PAI"));
					return pais;
				};
			}));
			compile();
		}

		public Map execute() {
			Map inpPai = new HashMap();
			return super.execute(inpPai);
		}
	}

	public List<Actividad> getActividadList(final String filtroAct) {
		try {
			P_KS_PAR_ACTIVIDAD_SEL sproc = new P_KS_PAR_ACTIVIDAD_SEL(this.dataSource);
			Map resAct = sproc.execute(filtroAct);
			return (List<Actividad>) resAct.get("Resultado");
		} catch (Exception e) {
			ParametersDaoImpl.logger.error(e);
			return null;
		}
	}

	public class P_KS_PAR_ACTIVIDAD_SEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_KS_PAR_ACTIVIDAD_SEL";
		private static final String DESACT = "DESACT";

		public P_KS_PAR_ACTIVIDAD_SEL(final DataSource dataSource) {
			super(dataSource, P_KS_PAR_ACTIVIDAD_SEL.SPROC_NAME);
			declareParameter(new SqlParameter(P_KS_PAR_ACTIVIDAD_SEL.DESACT, Types.VARCHAR));

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					Actividad actividad = new Actividad();
					actividad.setId(rs.getInt("COD_ACT"));
					actividad.setName(rs.getString("DES_ACT"));
					return actividad;
				};
			}));
			compile();
		}

		public Map execute(final String filtroAct) {
			Map inpAct = new HashMap();
			inpAct.put(P_KS_PAR_ACTIVIDAD_SEL.DESACT, new String(filtroAct));
			return super.execute(inpAct);
		}
	}

	public List<AuthorizedUser> getUserList(final String profileKey) {
		try {
			P_KS_PAR_USUARIOS_SEL sproc = new P_KS_PAR_USUARIOS_SEL(this.dataSource);
			Map resUsr = sproc.execute(profileKey);
			return (List<AuthorizedUser>) resUsr.get("Resultado");
		} catch (Exception e) {
			ParametersDaoImpl.logger.error(e);
			return null;
		}
	}

	public class P_KS_PAR_USUARIOS_SEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_KS_PAR_USUARIOS_SEL";
		private static final String PERFIL = "PERFIL";

		public P_KS_PAR_USUARIOS_SEL(final DataSource dataSource) {
			super(dataSource, P_KS_PAR_USUARIOS_SEL.SPROC_NAME);
			declareParameter(new SqlParameter(P_KS_PAR_USUARIOS_SEL.PERFIL, Types.VARCHAR));

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					AuthorizedUser au = new AuthorizedUser();
					au.setPeopleSoft(rs.getString("USUARIO"));
					au.setfName(rs.getString("NOMBRE"));
					au.setlName(rs.getString("APELLIDO"));
					au.setProfileKey(rs.getString("PERFIL"));
					return au;
				};
			}));
			compile();
		}

		public Map execute(final String profileKey) {
			Map inpUsr = new HashMap();
			inpUsr.put(P_KS_PAR_USUARIOS_SEL.PERFIL, new String(profileKey));
			return super.execute(inpUsr);
		}
	}

	public List<EstadoKYC> getEstadoKYCList(final String codigo) {
		try {
			P_KS_PAR_ESTADOKYC_SEL sproc = new P_KS_PAR_ESTADOKYC_SEL(this.dataSource);
			Map resEst = sproc.execute(codigo);
			return (List<EstadoKYC>) resEst.get("Resultado");
		} catch (Exception e) {
			ParametersDaoImpl.logger.error(e);
			return null;
		}
	}

	public class P_KS_PAR_ESTADOKYC_SEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_KS_PAR_ESTADOKYC_SEL";
		private static final String ESTADO = "ESTADO";

		public P_KS_PAR_ESTADOKYC_SEL(final DataSource dataSource) {
			super(dataSource, P_KS_PAR_ESTADOKYC_SEL.SPROC_NAME);
			declareParameter(new SqlParameter(P_KS_PAR_ESTADOKYC_SEL.ESTADO, Types.VARCHAR));

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					EstadoKYC estadoKYC = new EstadoKYC();
					estadoKYC.setCodigo(rs.getString("COD_EST"));
					estadoKYC.setCodigo(rs.getString("DES_EST"));
					return estadoKYC;
				};
			}));
			compile();
		}

		public Map execute(final String codigo) {
			Map inpEst = new HashMap();
			inpEst.put(P_KS_PAR_ESTADOKYC_SEL.ESTADO, new String(codigo));
			return super.execute(inpEst);
		}
	}

	public String getParamGral(final String param) {
		try {
			P_CI_PAR_PARAMGRL_SEL sproc = new P_CI_PAR_PARAMGRL_SEL(this.dataSource);
			Map resPar = sproc.execute(param);
			List<String> idParamList = (List<String>) resPar.get("Resultado");
			return idParamList.get(0);
		} catch (Exception e) {
			ParametersDaoImpl.logger.error(e);
			return null;
		}
	}

	public class P_CI_PAR_PARAMGRL_SEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_CI_PAR_PARAMGRL_SEL";
		private static final String COD_PAR = "COD_PAR";

		public P_CI_PAR_PARAMGRL_SEL(final DataSource dataSource) {
			super(dataSource, P_CI_PAR_PARAMGRL_SEL.SPROC_NAME);
			declareParameter(new SqlParameter(P_CI_PAR_PARAMGRL_SEL.COD_PAR, Types.VARCHAR));

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					String brokerId = rs.getString("PARVAL");
					return brokerId;
				};
			}));
			compile();
		}

		public Map execute(final String param) {
			Map inpPar = new HashMap();
			inpPar.put(P_CI_PAR_PARAMGRL_SEL.COD_PAR, new String(param));
			return super.execute(inpPar);
		}
	}
}