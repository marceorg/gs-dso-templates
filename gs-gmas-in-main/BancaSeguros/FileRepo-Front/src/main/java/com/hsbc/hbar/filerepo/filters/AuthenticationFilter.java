/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2018. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.filerepo.filters;

import java.io.IOException;
import java.security.SecureRandom;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class AuthenticationFilter implements Filter {
	// private ServletContext context;

	public void init(final FilterConfig fConfig) throws ServletException {
		/*
		 * this.context = fConfig.getServletContext();
		 * this.context.log("AuthenticationFilter initialized");
		 */
	}

	public void doFilter(final ServletRequest request, final ServletResponse response, final FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;
		String uri = req.getRequestURI();
		HttpSession session = req.getSession(false);
		if (uri.endsWith("getAuthorizedUser") || uri.endsWith("setAuthorizedUser")) {
			// pass the request along the filter chain
			chain.doFilter(request, response);
		} else if (session == null || session.getAttribute("authorizedUser") == null) {
			res.sendRedirect("/FileRepo-Front/pages/includes/sessExp.html?r=" + generateRnd(10));
		} else {
			// pass the request along the filter chain
			chain.doFilter(request, response);
		}
	}

	public void destroy() {
		// close any resources here
	}

	private String generateRnd(final Integer len) {
		SecureRandom sr = new SecureRandom();
		String result = (sr.nextInt(9) + 1) + "";
		for (int i = 0; i < len - 2; i++) {
			result += sr.nextInt(10);
		}
		result += (sr.nextInt(9) + 1);
		return result;
	}
}
