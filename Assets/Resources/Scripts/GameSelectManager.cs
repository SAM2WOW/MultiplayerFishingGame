using UnityEngine;
using UnityEngine.UI;
using Alteruna;
using Alteruna.Trinity;

public class GameSelectManager : MonoBehaviour
{
    [Header("Game Mode Objects")]
    public GameObject mainMenuPanel;    // Main menu with Host/Player buttons
    public GameObject hostGameObject;   // Contains all host-specific UI/functionality
    public GameObject playerGameObject; // Contains all player-specific UI/functionality
    public GameObject multiplayerLobbyMenu; // Contains all multiplayer lobby UI/functionality
    
    [Header("Button References")]
    public Button hostButton;          // Button to select host mode
    public Button playerButton;        // Button to select player mode
    public Button startGameButton;     // Button to start the game (in host panel)
    public Button backToMenuButton;    // Button to return to mode selection
    
    [Header("Game Manager Reference")]
    public GameManager gameManager;    // Reference to your game manager
    
    public enum PlayerType { Host, Player }
    public PlayerType playerType;
    
    void Start()
    {
        // Initialize scene - show main menu, hide others
        ShowMainMenu();
        
        // Set up button listeners
        if (hostButton != null)
            hostButton.onClick.AddListener(SelectHostMode);
        
        if (playerButton != null)
            playerButton.onClick.AddListener(SelectPlayerMode);
        
        if (startGameButton != null)
            startGameButton.onClick.AddListener(StartGame);
        
        // if (backToMenuButton != null)
        //     backToMenuButton.onClick.AddListener(ShowMainMenu);
    }
    
    void ShowMainMenu()
    {
        // Show main menu, hide other panels
        SetActiveState(mainMenuPanel, true);
        SetActiveState(hostGameObject, false);
        SetActiveState(playerGameObject, false);
        SetActiveState(multiplayerLobbyMenu, false);
    }
    
    void SelectHostMode()
    {
        // Show host panel, hide others
        // SetActiveState(mainMenuPanel, false);
        SetActiveState(hostGameObject, true);
        SetActiveState(playerGameObject, false);

        SetActiveState(hostButton.gameObject, false);
        SetActiveState(playerButton.gameObject, false);
        // SetActiveState(startGameButton.gameObject, false);

        // create multiplayer room with random int name
        gameManager.createRoom();

        // Set player type to host
        playerType = PlayerType.Host;
    }
    
    
    void SelectPlayerMode()
    {
        // Show player panel, hide others
        SetActiveState(mainMenuPanel, false);
        SetActiveState(hostGameObject, false);
        SetActiveState(playerGameObject, false);
        SetActiveState(multiplayerLobbyMenu, true);

        // Set player type to player
        playerType = PlayerType.Player;
    }
    public void onRoomCreated()
    {
        if (playerType != PlayerType.Host)
            return;
        
        // Show start game button
        SetActiveState(startGameButton.gameObject, true);
    }

    public void OnPlayerRoomJoined()
    {
        if (playerType != PlayerType.Player)
            return;
        
        // Show player panel, hide others
        SetActiveState(mainMenuPanel, false);
        SetActiveState(hostGameObject, false);
        SetActiveState(playerGameObject, true);
        SetActiveState(multiplayerLobbyMenu, false);
    }
    
    void StartGame()
    {
        // Check if game manager exists
        if (gameManager == null)
        {
            Debug.LogError("GameManager reference not set in GameSelectManager!");
            return;
        }
        
        // Start the game by calling the StartGameSequence method
        gameManager.StartGameSequence();
        
        // Optional: Hide UI elements that shouldn't be visible during gameplay
        SetActiveState(mainMenuPanel, false);
        // SetActiveState(hostGameObject, false);
        // SetActiveState(playerGameObject, false);
    }
    
    // Helper function to safely set active state
    private void SetActiveState(GameObject obj, bool state)
    {
        if (obj != null)
            obj.SetActive(state);
    }
}