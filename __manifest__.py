# -*- coding: utf-8 -*-
{
    'name': 'VerityPack Custom Apps Dashboard',
    'version': '1.0.0',
    'summary': 'Fullscreen App Switcher & Dashboard for Selecting Apps',
    'description': '''
        Fullscreen modern application launcher grid that replaces the default small dropdown
        with a beautiful fullscreen overlay to select apps with cards, icons, and glassmorphism.
    ''',
    'category': 'Extra Tools',
    'author': 'VerityPack Cloud',
    'depends': ['base', 'web'],
    'data': [],
    'assets': {
        'web.assets_backend': [
            'veritypack_custom_dashboard/static/src/scss/apps_grid.scss',
            'veritypack_custom_dashboard/static/src/js/apps_grid.js',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
    'license': 'LGPL-3',
}
