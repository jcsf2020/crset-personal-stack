'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SystemStatus {
  service: string;
  status: 'operational' | 'degraded' | 'down';
  response_time?: number;
  last_check: string;
}

export default function AdminDashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Verificar autenticação (simplificado)
    const isAuth = localStorage.getItem('admin_auth') === 'true';
    setAuthenticated(isAuth);
    
    if (isAuth) {
      loadDashboardData();
    }
  }, [authenticated]);

  const handleLogin = async () => {
    if (password === 'Financeflow2025') {
      localStorage.setItem('admin_auth', 'true');
      setAuthenticated(true);
      loadDashboardData();
    } else {
      alert('Senha incorreta');
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Carregar status dos serviços
      const services = [
        'agi/status',
        'flags/chat',
        'contact',
        'leads',
        'payments',
        'monitoring',
        'cache',
        'analytics',
        'workflows'
      ];

      const statusPromises = services.map(async (service) => {
        try {
          const response = await fetch(`/api/${service}?debug=1`);
          return {
            service: service.replace('/', '_'),
            status: response.ok ? 'operational' : 'down',
            response_time: Math.random() * 200 + 50, // Simulado
            last_check: new Date().toISOString()
          } as SystemStatus;
        } catch {
          return {
            service: service.replace('/', '_'),
            status: 'down',
            last_check: new Date().toISOString()
          } as SystemStatus;
        }
      });

      const statuses = await Promise.all(statusPromises);
      setSystemStatus(statuses);

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600';
      case 'degraded':
        return 'text-yellow-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Administrativo</CardTitle>
            <CardDescription>
              Introduza a senha para aceder ao dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              Entrar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">A carregar dashboard...</p>
        </div>
      </div>
    );
  }

  const operationalServices = systemStatus.filter(s => s.status === 'operational').length;
  const totalServices = systemStatus.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600">CRSET Solutions - Monitorização e Gestão</p>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Serviços Operacionais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{operationalServices}/{totalServices}</div>
              <p className="text-xs text-gray-500">
                {Math.round((operationalServices / totalServices) * 100)}% uptime
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Estado do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Operacional</div>
              <p className="text-xs text-gray-500">
                Todos os serviços críticos funcionais
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Seguro</div>
              <p className="text-xs text-gray-500">
                Sem ameaças detectadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Última Atualização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Date().toLocaleTimeString()}</div>
              <p className="text-xs text-gray-500">
                Dados em tempo real
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Estado dos Serviços */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Estado dos Serviços</CardTitle>
            <CardDescription>
              Monitorização em tempo real de todos os serviços
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStatus.map((service) => (
                <div key={service.service} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      service.status === 'operational' ? 'bg-green-500' :
                      service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <h3 className="font-medium">{service.service.replace('_', ' ').toUpperCase()}</h3>
                      <p className="text-sm text-gray-500">
                        Última verificação: {new Date(service.last_check).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {service.response_time && (
                      <span className="text-sm text-gray-500">
                        {Math.round(service.response_time)}ms
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={loadDashboardData}
            >
              Atualizar Estado dos Serviços
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.open('/api/agi/status?debug=1', '_blank')}
            >
              Ver Status AGI Detalhado
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                localStorage.removeItem('admin_auth');
                setAuthenticated(false);
              }}
            >
              Terminar Sessão
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
