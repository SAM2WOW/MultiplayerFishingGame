using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using Alteruna;
using System.Collections.Generic;

public class GameManager : Synchronizable
{
    [Header("Fish Spawning")]
    public GameObject fishPrefab;  // Assign your fish prefab in inspector
    public int numberOfFishToSpawn = 9;
    public float spawnAreaWidth = 8f;
    public float spawnAreaHeight = 4f;
    // keep track of the fishes in a list
    public List<FishController> fishControllers = new List<FishController>();

    [Header("UI References")]
    public TextMeshProUGUI countdownText;  // Assign in inspector
    public TextMeshProUGUI timerText;      // Assign in inspector
    public TextMeshProUGUI playerTimerText;      // Assign in inspector
    public TextMeshProUGUI roomNameText;      // Assign in inspector
    public GameObject gameOverPanel;       // Assign in inspector
    
    [Header("Game Settings")]
    public float countdownDuration = 3f;   // 3 seconds countdown
    public float gameDuration = 30f;       // 30 seconds game time
    public Multiplayer multiplayerManager; // Reference to your multiplayer manager
    
    // Game state
    private enum GameState { NotStarted, Initializing, Countdown, Playing, Finished }
    private GameState currentState;
    private GameState _oldCurrentState;
    private float gameTimer = 0f;
    private float _oldSynchronizedGameTimer = 0f;
    private Coroutine gameSequenceCoroutine;
    
    void Start()
    {
        // Hide game over panel initially
        if (gameOverPanel != null)
            gameOverPanel.SetActive(false);
        
        // Initialize state
        currentState = GameState.Initializing;
        _oldCurrentState = currentState;
        
        // Start the game sequence
        // StartCoroutine(GameSequence());
    }

    public void createRoom()
    {
        string roomName = "FishRoom" + Random.Range(0, 1000);
        multiplayerManager.CreateRoom(roomName, maxUsers: 10);

        roomNameText.text = roomName;
    }
    
    // Public method that can be called by GameSelectManager
    public void StartGameSequence()
    {
        // Only start the game if it's not already started
        if (currentState != GameState.Initializing)
            return;
        
        // Initialize and start the game sequence
        currentState = GameState.Initializing;
        gameSequenceCoroutine = StartCoroutine(GameSequence());
        
        // Show countdown and timer UI
        if (countdownText != null)
            countdownText.gameObject.SetActive(true);
        if (timerText != null)
            timerText.gameObject.SetActive(true);
        if (playerTimerText != null)
            playerTimerText.gameObject.SetActive(true);
    }
    
    void Update()
    {
        // If the value of our float has changed, sync it with the other players in our playroom.
        if (gameTimer != _oldSynchronizedGameTimer)
        {
            // Store the updated value
            _oldSynchronizedGameTimer = gameTimer;

            // Tell Alteruna that we want to commit our data.
            Commit();
        }

        // Update the Synchronizable
        SyncUpdate();
        UpdateTimerDisplay();

        if (currentState == GameState.Playing)
        {
            // Update game timer
            if (gameTimer > 0)
            {
                gameTimer -= Time.deltaTime;
                
                if (gameTimer <= 0)
                {
                    gameTimer = 0;
                    EndGame();
                }
            }
        }
    }

    public override void DisassembleData(Reader reader, byte LOD)
		{
			// Set our data to the updated value we have recieved from another player.
			gameTimer = reader.ReadFloat();

			// Save the new data as our old data, otherwise we will immediatly think it changed again.
			_oldSynchronizedGameTimer = gameTimer;
		}

    public override void AssembleData(Writer writer, byte LOD)
    {
        // Write our data so that it can be sent to the other players in our playroom.
        writer.Write(gameTimer);
    }
    
    IEnumerator GameSequence()
    {
        // Spawn fish
        SpawnFish();
        
        yield return new WaitForSeconds(0.5f);  // Short delay before countdown
        
        // Begin countdown
        currentState = GameState.Countdown;
        
        // 3, 2, 1 countdown
        for (int i = (int)countdownDuration; i > 0; i--)
        {
            if (countdownText != null)
                countdownText.text = i.ToString();
            yield return new WaitForSeconds(1f);
        }
        
        // Start game
        if (countdownText != null)
            countdownText.text = "GO!";
        currentState = GameState.Playing;
        gameTimer = gameDuration;
        UpdateTimerDisplay();
        
        yield return new WaitForSeconds(0.5f);
        
        if (countdownText != null)
            countdownText.gameObject.SetActive(false);
    }
    
    void SpawnFish()
    {
        if (fishPrefab == null)
        {
            Debug.LogError("Fish prefab not assigned to GameManager!");
            return;
        }
        
        for (int i = 0; i < numberOfFishToSpawn; i++)
        {
            // Random position within spawn area
            Vector3 spawnPosition = new Vector3(
                Random.Range(-spawnAreaWidth/2, spawnAreaWidth/2),
                Random.Range(-spawnAreaHeight/2, spawnAreaHeight/2),
                0
            );
            
            // Random rotation
            Quaternion spawnRotation = Quaternion.Euler(0, 0, Random.Range(0f, 360f));
            
            // Spawn the fish
            GameObject fish = Instantiate(fishPrefab, spawnPosition, spawnRotation);
            
            // You can customize each fish here if needed
            FishController fishController = fish.GetComponent<FishController>();
            if (fishController != null)
            {
                // Give Fish ID
                fishController.fishID = i;

                // Add fish controller to the list
                fishControllers.Add(fishController);

                // set the size enum of the fish (public enum FishSize { Small, Medium, Large })
                // the first 3 is small, the next 3 is medium, the last 3 is large
                if (i < 3)
                {
                    fishController.fishSize = FishController.FishSize.Small;
                }
                else if (i < 6)
                {
                    fishController.fishSize = FishController.FishSize.Medium;
                }
                else
                {
                    fishController.fishSize = FishController.FishSize.Large;
                }

                // Optional: Randomize fish parameters
                fishController.moveSpeed = Random.Range(1f, 3f);
                fishController.turnRate = Random.Range(0.3f, 1.2f);
            }
        }
    }

    void CatchFish(int playerID, int fishID)
    {
        // Optional: You could add a score system here
        // For example, increment a score variable and update a UI element
        // You could also play a sound effect, particle effect, etc.
        switch (fishControllers[fishID].fishSize)
        {
            case FishController.FishSize.Small:
                // Small fish caught
                break;
            case FishController.FishSize.Medium:
                // Medium fish caught
                break;
            case FishController.FishSize.Large:
                // Large fish caught
                break;
        }

        // Destroy the fish
        fishControllers[fishID].CatchFish();
    }
    
    void UpdateTimerDisplay()
    {
        if (timerText != null)
        {
            int seconds = Mathf.CeilToInt(gameTimer);
            timerText.text = $"Time: {seconds}";
        }

        if (playerTimerText != null)
        {
            int seconds = Mathf.CeilToInt(gameTimer);
            playerTimerText.text = $"Time: {seconds}";
        }
    }
    
    void EndGame()
    {
        currentState = GameState.Finished;
        
        // Show game over panel
        if (gameOverPanel != null)
            gameOverPanel.SetActive(true);
        
        // Optional: You could disable fish movement here
        FishController[] allFish = FindObjectsOfType<FishController>();
        foreach (FishController fish in allFish)
        {
            fish.enabled = false;  // Disable the fish movement script
        }
    }
    
    // Public method to restart the game (can be called from UI button)
    public void RestartGame()
    {
        UnityEngine.SceneManagement.SceneManager.LoadScene(
            UnityEngine.SceneManagement.SceneManager.GetActiveScene().name
        );
    }
}
