;; -*- no-byte-compile: t; -*-

;; evil

(package! evil-cleverparens)
(package! evil-iedit-state)
(package! evil-lion)
(package! evil-matchit)
(package! evil-quickscope)
(package! evil-rails)
(package! evil-ruby-text-objects)
(package! evil-string-inflection)
(package! evil-tex)
(package! evil-unimpaired :recipe (:host github :repo "zmaas/evil-unimpaired"))

;; org

(package! anki-connect)
(package! anki-editor)
(package! ob-mermaid)
(package! org-appear :recipe (:host github :repo "awth13/org-appear"))
(package! org-bullets)
(package! org-fancy-priorities)
(package! org-projectile)
(package! org-superstar)
(package! org-super-agenda)
(package! ox-gfm)

;; text editing

(package! copilot :recipe (:host github :repo "copilot-emacs/copilot.el" :files ("*.el")))
(package! copilot-chat :recipe (:host github :repo "chep/copilot-chat.el" :files ("*.el")))
(package! seeing-is-believing) ;; evaluate expressions as a comment
(package! typopunct) ;; insert en/em dashes, curly quotes
(package! yankee :recipe (:host github :repo "h35514n/yankee.el" :files ("yankee.el")))
;; (package! aider :recipe (:host github :repo "tninja/aider.el" :files ("aider*.el")))
;; (package! ggtags :recipe (:host github :repo "leoliu/ggtags"))
;; (package! gxref :recipe (:host github :repo "dedi/gxref"))

;; ui enhancements

(package! casual) ;; magit-like menus
(package! centered-window) ;; what it says on the tin
(package! command-log-mode) ;; log commands to a buffer
(package! dash-at-point) ;; look up in dash
(package! exercism) ;; download exercises
(package! xwwp :recipe (:host github :repo "canatella/xwwp")) ;; browser enhancements
(package! py-vterm-interaction)

;; disabled

(disable-packages! minitest)
(disable-packages! company-gtags)
(disable-packages! evil-snipe)
(disable-packages! git-gutter)
(disable-packages! git-gutter-fringe)

;; probationary
