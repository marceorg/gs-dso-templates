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

import com.hsbc.hbar.kycseg.dao.CPFinderDao;
import com.hsbc.hbar.kycseg.model.common.CPFinder;

public class CPFinderDaoImpl implements CPFinderDao {
	static Logger logger = LogManager.getLogger(CPFinderDaoImpl.class);

	private DataSource dataSource;

	public void setDataSource(final DataSource datasource) {
		this.dataSource = datasource;
	}

	public DataSource getDataSource() {
		return this.dataSource;
	}

	public List<CPFinder> getCPList(final Integer provincia, final String calleLoc) {
		try {
			P_KS_PAR_CPFINDER_SEL sproc = new P_KS_PAR_CPFINDER_SEL(this.dataSource);
			Map resCPL = sproc.execute(provincia, calleLoc);
			return (List<CPFinder>) resCPL.get("Resultado");
		} catch (Exception e) {
			CPFinderDaoImpl.logger.error(e);
			return null;
		}
	}

	public class P_KS_PAR_CPFINDER_SEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_KS_PAR_CPFINDER_SEL";
		private static final String PROVICOD = "PROVICOD";
		private static final String CALLELOC = "CALLELOC";

		public P_KS_PAR_CPFINDER_SEL(final DataSource dataSource) {
			super(dataSource, P_KS_PAR_CPFINDER_SEL.SPROC_NAME);
			declareParameter(new SqlParameter(P_KS_PAR_CPFINDER_SEL.PROVICOD, Types.INTEGER));
			declareParameter(new SqlParameter(P_KS_PAR_CPFINDER_SEL.CALLELOC, Types.VARCHAR));

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					CPFinder cpFinder = new CPFinder();
					cpFinder.setCodigoPostal(rs.getString("CODPOS"));
					cpFinder.setCalle(rs.getString("CALLE"));
					cpFinder.setAlturaDesde(rs.getString("DESDE"));
					cpFinder.setAlturaHasta(rs.getString("HASTA"));
					return cpFinder;
				};
			}));
			compile();
		}

		public Map execute(final Integer provincia, final String calleLoc) {
			Map inpCPL = new HashMap();
			inpCPL.put(P_KS_PAR_CPFINDER_SEL.PROVICOD, new Integer(provincia));
			inpCPL.put(P_KS_PAR_CPFINDER_SEL.CALLELOC, new String(calleLoc));
			return super.execute(inpCPL);
		}
	}

	public Boolean getValCPXAltura(final String calle, final String numero, final String codigoPostal) {
		try {
			P_KS_PAR_CPFINDER_XALT_SEL sproc = new P_KS_PAR_CPFINDER_XALT_SEL(this.dataSource);
			Map resCPA = sproc.execute(calle, numero, codigoPostal);
			List<Boolean> boleanList = (List<Boolean>) resCPA.get("Resultado");
			return boleanList.get(0);
		} catch (Exception e) {
			CPFinderDaoImpl.logger.error(e);
			return null;
		}
	}

	public class P_KS_PAR_CPFINDER_XALT_SEL extends StoredProcedure {
		private static final String SPROC_NAME = "P_KS_PAR_CPFINDER_XALT_SEL";
		private static final String CALLE = "CALLE";
		private static final String NUMERO = "NUMERO";
		private static final String CODPOS = "CODPOS";

		public P_KS_PAR_CPFINDER_XALT_SEL(final DataSource dataSource) {
			super(dataSource, P_KS_PAR_CPFINDER_XALT_SEL.SPROC_NAME);
			declareParameter(new SqlParameter(P_KS_PAR_CPFINDER_XALT_SEL.CALLE, Types.VARCHAR));
			declareParameter(new SqlParameter(P_KS_PAR_CPFINDER_XALT_SEL.NUMERO, Types.NUMERIC));
			declareParameter(new SqlParameter(P_KS_PAR_CPFINDER_XALT_SEL.CODPOS, Types.NUMERIC));

			declareParameter(new SqlReturnResultSet("Resultado", new RowMapper() {
				public Object mapRow(final ResultSet rs, final int cant) throws SQLException {
					Boolean result = false;
					if (rs.getString("RESULT").equalsIgnoreCase("OK")) {
						result = true;
					}
					return result;
				};
			}));
			compile();
		}

		public Map execute(final String calle, final String numero, final String codigoPostal) {
			Map inpCPA = new HashMap();
			inpCPA.put(P_KS_PAR_CPFINDER_XALT_SEL.CALLE, new String(calle));
			inpCPA.put(P_KS_PAR_CPFINDER_XALT_SEL.NUMERO, new String(numero));
			inpCPA.put(P_KS_PAR_CPFINDER_XALT_SEL.CODPOS, new String(codigoPostal));
			return super.execute(inpCPA);
		}
	}
}
